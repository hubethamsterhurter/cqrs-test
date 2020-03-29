import { autobind } from 'core-decorators';
import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionService } from "./session.service";
import { SessionRepository } from "./session.repository";
import { HandleClientMessage } from '../../decorators/handle-client-message.decorator';
import { ClientMessageLogIn } from '../../../shared/message-client/models/client-message.log-in';
import { ServerEventSocketClientMessageParsed } from '../../events/models/server-event.socket-client.message-parsed';
import { UserRepository } from '../user/user.repository';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { ClientMessageLogOut } from '../../../shared/message-client/models/client-message.log-out';
import { ClientMessageSignUp } from '../../../shared/message-client/models/client-message.sign-up';
import { USER_COLOURS } from '../../../shared/constants/user-colour';
import { randomElement } from '../../../shared/helpers/random-element';
import { ClientMessageCreateUser } from '../../../shared/message-client/models/client-message.create-user';
import { ClientMessageUpdateUser } from '../../../shared/message-client/models/client-message.update-user';
import { UserService } from '../user/user.service';
import { ServerMessageError } from "../../../shared/message-server/models/server-message.error";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SessionGateway {
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
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @HandleClientMessage(ClientMessageSignUp)
  async handleClientSignUp(evt: ServerEventSocketClientMessageParsed<ClientMessageSignUp>) {
    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._userService.signUp(
      session,
      {
        user_name: evt._p.message.user_name,
        password: evt._p.message.password,
      },
      evt._o,
    );
  }


  /**
   * @description
   * Fired when as client tries to create user
   * 
   * @param evt 
   */
  @HandleClientMessage(ClientMessageCreateUser)
  async handleClientCreateUser(evt: ServerEventSocketClientMessageParsed<ClientMessageCreateUser>) {
    await this._userService.create(
      {
        user_name: evt._p.message.user_name,
        password: evt._p.message.password,
        colour: randomElement(USER_COLOURS),
      },
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
    const user = await this._userRepo.findOne(evt._p.message.id);
    if (!user) {
      // TODO: report fail
      return;
    }

    await this._userService.update(
      user,
      {
        user_name: evt._p.message.user_name,
        password: evt._p.message.password,
        // colour: evt._p.message.colour
      },
      evt._o,
    );
  }



  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @note have to decorate the class and reflect on the methods metadata to bind these methods, or something
   * 
   * @param evt 
   */
  @HandleClientMessage(ClientMessageLogIn)
  async handleClientMessageLogIn(evt: ServerEventSocketClientMessageParsed<ClientMessageLogIn>) {
    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    const user = await this._userRepo.findByUserName(evt._p.message.user_name);

    if (!user) {
      // can't find user
      const msg = 'Cannot log in. User not found.';
      this._log.warn(msg);
      evt._p.socket.send(new ServerMessageError({
        _o: evt._o.clone(),
        code: 404,
        message: msg,
      }));
      return;
    }

    if (!this._userService.passwordMatch(user, evt._p.message.password)) {
      // failed to log in
      const msg = 'Cannot log in. Password does not match.';
      this._log.warn(msg);
      evt._p.socket.send(new ServerMessageError({
        _o: evt._o.clone(),
        code: 422,
        message: msg,
      }));
      return;
    }

    await this._sessionService.authenticate(
      session,
      user,
      evt._o,
    );
  }



  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @HandleClientMessage(ClientMessageLogOut)
  async handleClientMessageLogOut(evt: ServerEventSocketClientMessageParsed<ClientMessageLogOut>) {
    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    if (session.user_id) {
      const user = await this._userRepo.findOneOrFail(session.user_id);
      this._sessionService.logout(
        session,
        user,
        evt._o,
      );
    }
  }
}