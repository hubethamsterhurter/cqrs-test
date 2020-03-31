import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { HandleCm } from '../../decorators/handle-cm.decorator';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { UserRepository } from '../user/user.repository';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { USER_COLOURS } from '../../../shared/constants/user-colour';
import { randomElement } from '../../../shared/helpers/random-element';
import { CreateUserCmo } from '../../../shared/message-client/models/create-user.cmo';
import { UpdateUserCmo } from '../../../shared/message-client/models/update-user.cmo';
import { UserService } from '../user/user.service';
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { ServerMessageError } from "../../../shared/message-server/models/server-message.error";
import { SEConsumer } from "../../decorators/se-consumer.decorator";
import { SessionRepository } from "../session/session.repository";
import { SessionService } from "../session/session.service";
import { CreateUserDto } from "../../../shared/domains/user/dto/create-user.dto";
import { UpdateUserDto } from "../../../shared/domains/user/dto/update-user.dto";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SEConsumer()
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
    const user = await this._userRepo.findByUserName(evt._p.message.dto.user_name)

    if (user) {
      evt._p.socket.send(new ServerMessageError({
        trace: evt.trace.clone(),
        code: 422,
        message: `User ${evt._p.message.dto.user_name} already exists`,
      }));
      return;
    }

    await this._userService.create(
      new CreateUserDto({
        user_name: evt._p.message.dto.user_name,
        password: evt._p.message.dto.password,
        colour: randomElement(USER_COLOURS),
      }),
      evt.trace,
    );
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @HandleCm(UpdateUserCmo)
  async update(evt: SCMessageSeo<UpdateUserCmo>) {
    const user = await this._userRepo.findByUserName(evt._p.message.dto.id);

    if (!user) {
      evt._p.socket.send(new ServerMessageError({
        trace: evt.trace.clone(),
        code: 404,
        message: `User ${evt._p.message.dto.id} not found`,
      }));
      return;
    }

    await this._userService.update(
      user,
      new UpdateUserDto({
        id: user.id,
        user_name: evt._p.message.dto.user_name,
        password: evt._p.message.dto.password,
        colour: evt._p.message.dto.colour,
      }),
      evt.trace,
    );
  }
}