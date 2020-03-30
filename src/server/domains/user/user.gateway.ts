import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { HandleClientMessage } from '../../decorators/handle-client-message.decorator';
import { ServerEventSocketClientMessageParsed } from '../../events/models/server-event.socket-client.message-parsed';
import { UserRepository } from '../user/user.repository';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { USER_COLOURS } from '../../../shared/constants/user-colour';
import { randomElement } from '../../../shared/helpers/random-element';
import { ClientMessageCreateUser } from '../../../shared/message-client/models/client-message.create-user';
import { ClientMessageUpdateUser } from '../../../shared/message-client/models/client-message.update-user';
import { UserService } from '../user/user.service';
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { ServerMessageError } from "../../../shared/message-server/models/server-message.error";
import { ServerEventConsumer } from "../../decorators/server-event-consumer.decorator";
import { SessionRepository } from "../session/session.repository";
import { SessionService } from "../session/session.service";
import { CreateUserDto } from "../../../shared/domains/user/dto/create-user.dto";
import { UpdateUserDto } from "../../../shared/domains/user/dto/update-user.dto";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@ServerEventConsumer()
export class UserGateway {
  private _log = new ClassLogger(this);


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
  @HandleClientMessage(ClientMessageCreateUser)
  async handleClientCreateUser(evt: ServerEventSocketClientMessageParsed<ClientMessageCreateUser>) {
    const user = await this._userRepo.findByUserName(evt._p.message.user_name)

    if (user) {
      evt._p.socket.send(new ServerMessageError({
        _o: evt._o.clone(),
        code: 422,
        message: `User ${evt._p.message.user_name} already exists`,
      }));
      return;
    }

    await this._userService.create(
      new CreateUserDto({
        user_name: evt._p.message.user_name,
        password: evt._p.message.password,
        colour: randomElement(USER_COLOURS),
      }),
      evt._o,
    );
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @HandleClientMessage(ClientMessageUpdateUser)
  async handleClientUpdateUser(evt: ServerEventSocketClientMessageParsed<ClientMessageUpdateUser>) {
    const user = await this._userRepo.findByUserName(evt._p.message.id);

    if (!user) {
      evt._p.socket.send(new ServerMessageError({
        _o: evt._o.clone(),
        code: 404,
        message: `User ${evt._p.message.id} not found`,
      }));
      return;
    }

    await this._userService.update(
      user,
      new UpdateUserDto({
        id: user.id,
        user_name: evt._p.message.user_name,
        password: evt._p.message.password,
        colour: evt._p.message.colour,
      }),
      evt._o,
    );
  }
}