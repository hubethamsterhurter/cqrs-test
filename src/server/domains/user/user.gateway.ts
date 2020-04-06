import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SubscribeMessage } from '../../decorators/subscribe-message.decorator';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { UserRepository } from '../user/user.repository';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { USER_COLOUR } from '../../../shared/constants/user-colour';
import { UserCrudService } from './user.crud.service';
import { SocketWarehouse } from "../../web-sockets/socket-warehouse/socket-warehouse";
import { ErrorSmo, ErrorSmDto } from "../../../shared/smo/error.smo";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { SessionRepository } from "../session/session.repository";
import { SessionCrudService } from "../session/session.crud.service";
import { CreateUserCmo } from "../../../shared/domains/user/cmo/create-user.cmo";
import { UpdateUserCmo } from "../../../shared/domains/user/cmo/update-user.cmo";
import { HTTP_CODE } from "../../../shared/constants/http-code.constant";
import { ctorName } from "../../../shared/helpers/ctor-name.helper";
import { UserModel } from "../../../shared/domains/user/user.model";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
export class UserGateway {
  private _log = new Logger(this);


  /**
   * @constructor
   * 
   * @param _sessionService
   * @param _userService
   * @param _sessionRepo
   * @param _userRepo
   */
  constructor(
    @Inject(() => SessionCrudService) private readonly _sessionService: SessionCrudService,
    @Inject(() => UserCrudService) private readonly _userService: UserCrudService,
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Fired when as client tries to create user
   * 
   * @param evt 
   */
  @SubscribeMessage(CreateUserCmo)
  async create(evt: SCMessageSeo<CreateUserCmo>) {
    const user = await this._userRepo.findByUserName({ user_name: evt.dto.message.dto.user_name });

    if (user) {
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          message: `User ${evt.dto.message.dto.user_name} already exists`,
          code: HTTP_CODE._422,
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    await this._userService.create({
      fill: {
        colour: evt.dto.message.dto.colour || USER_COLOUR.BLACK,
      },
      user_name: evt.dto.message.dto.user_name,
      password: evt.dto.message.dto.password,
      requester: null,
      trace: evt.trace,
    });
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @SubscribeMessage(UpdateUserCmo)
  async update(evt: SCMessageSeo<UpdateUserCmo>) {
    // TODO:
    const user = await this._userRepo.findOne({ id: evt.dto.message.dto.id });

    if (!user) {
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          code: HTTP_CODE._404,
          message: `${ctorName(UserModel)}.${evt.dto.message.dto.id} not found`,
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    await this._userService.update({
      // user,
      id: user.id,
      fill: {
        colour: evt.dto.message.dto.colour,
      },
      user_name: evt.dto.message.dto.user_name,
      password: evt.dto.message.dto.password,
      requester: user,
      trace: evt.trace,
    });
  }
}