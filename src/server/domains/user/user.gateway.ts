import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { HandleCm } from '../../decorators/handle-cm.decorator';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { UserRepository } from '../user/user.repository';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { USER_COLOURS, USER_COLOUR } from '../../../shared/constants/user-colour';
import { randomElement } from '../../../shared/helpers/random-element';
import { UserService } from '../user/user.service';
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { ErrorSmo, ErrorSmDto } from "../../../shared/smo/error.smo";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { SessionRepository } from "../session/session.repository";
import { SessionService } from "../session/session.auth.service";
import { CreateUserCmDto, CreateUserCmo } from "../../../shared/domains/user/cmo/create-user.cmo";
import { UpdateUserCmDto, UpdateUserCmo } from "../../../shared/domains/user/cmo/update-user.cmo";
import { HTTP_CODE } from "../../../shared/constants/http-code.constant";


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
    @Inject(() => SessionService) private readonly _sessionService: SessionService,
    @Inject(() => UserService) private readonly _userService: UserService,
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
  @HandleCm(CreateUserCmo)
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
      raw: {
        colour: evt.dto.message.dto.colour || USER_COLOUR.BLACK,
      },
      user_name: evt.dto.message.dto.user_name,
      password: evt.dto.message.dto.password,
      requester: evt.,
      // new CreateUserCmDto({
      //   user_name: evt.dto.message.dto.user_name,
      //   password: evt.dto.message.dto.password,
      //   colour: randomElement(USER_COLOURS),
      // }),
      // evt.trace,
    });
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @HandleCm(UpdateUserCmo)
  async update(evt: SCMessageSeo<UpdateUserCmo>) {
    // TODO:
    const user = await this._userRepo.findByUserName({ user_name: evt.dto.message.dto.user_name });

    if (!user) {
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          code: HTTP_CODE._404,
          message: `User ${evt._p.message.dto.id} not found`,
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    await this._userService.update(
      user,
      new UpdateUserCmDto({
        id: user.id,
        user_name: evt.dto.message.dto.user_name,
        password: evt.dto.message.dto.password,
        colour: evt.dto.message.dto.colour,
      }),
      evt.trace,
    );
  }
}