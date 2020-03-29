import * as op from "rxjs/operators";
import { autobind } from 'core-decorators';
import { Service, Inject } from "typedi";
import { UserModel } from "../../../shared/domains/user/user.model";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { ChatRepository } from "../chat/chat.repository";
import { UserRepository } from "../user/user.repository";
import { ServerMessageInit } from "../../../shared/message-server/models/server-message.init";
import { ServerEventModelCreated } from "../../events/models/server-event.model-created";
import { ServerEventModelUpdated } from "../../events/models/server-event.model-updated";
import { serverModelCreatedEventOf, serverModelUpdatedEventOf, serverModelDeletedEventOf } from "../../helpers/server-model-event-filter.helper";
import { ServerMessageUserCreated } from "../../../shared/message-server/models/server-message.user.created";
import { ServerMessageChatCreated } from "../../../shared/message-server/models/server-message.chat.created";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { ServerMessageUserUpdated } from "../../../shared/message-server/models/server-message.user.updated";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { ServerMessageClientCreated } from "../../../shared/message-server/models/server-message.client.created";
import { ServerMessageClientUpdated } from "../../../shared/message-server/models/server-message.client.updated";
import { ServerEventModelDeleted } from "../../events/models/server-event.model-deleted";
import { ServerMessageClientDeleted } from "../../../shared/message-server/models/server-message.client.deleted";
import { ServerMessageAuthenticated } from "../../../shared/message-server/models/server-message.authenticated";
import { ServerEventUserLoggedIn } from "../../events/models/server-event.user.logged-in";
import { HandleServerModelCreatedEvent } from "../../decorators/handle-server-model-created-event.decorator";
import { HandleServerEvent } from "../../decorators/handle-server-event.decorator";
import { SessionService } from "./session.service";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { ServerEventSocketClientMessageInvalid } from "../../events/models/server-event.socket-client.message-invalid";
import { ServerMessageClientMessageInvalid } from "../../../shared/message-server/models/server-message.client-message-invalid";
import { ServerEventSocketClientMessageMalformed } from "../../events/models/server-event.socket-client.message-errored";
import { ServerMessageClientMessageMalformed } from "../../../shared/message-server/models/server-message.client-message-malformed";



// https://github.com/jayphelps/core-decorators/blob/master/src/autobind.js
let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SessionBroadcaster {
  private readonly _log = new ClassLogger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => ChatRepository) private readonly _chatRepo: ChatRepository,
    @Inject(() => SessionService) private readonly _sessionService: SessionService,
    @Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Fired when a model is created
   *
   * @param evt
   */
  @autobind
  @HandleServerEvent(ServerEventModelCreated)
  private async _handleModelCreated(evt: ServerEventModelCreated) {
    this._log.info('Broadcasting ServerEventModelCreated...', evt._p.CTor.name);

    if (serverModelCreatedEventOf(UserModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageUserCreated({
        model: evt._p.model,
        _o: evt._o.clone(),
      }));
    }

    else if (serverModelCreatedEventOf(ChatModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageChatCreated({
        model: evt._p.model,
        _o: evt._o.clone(),
      }));
    }

    else if (serverModelCreatedEventOf(SessionModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageClientCreated({
        model: evt._p.model,
        _o: evt._o.clone(),
      }));
    }
  }



  /**
   * @description
   * Fired when a model is updated
   *
   * @param evt
   */
  @autobind
  @HandleServerEvent(ServerEventModelUpdated)
  private async _handleModelUpdated(evt: ServerEventModelUpdated) {
    this._log.info('Broadcasting ServerEventModelUpdated...', evt._p.CTor.name);

    if (serverModelUpdatedEventOf(UserModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageUserUpdated({
        model: evt._p.model,
        _o: evt._o.clone(),
      }));
    }

    else if (serverModelUpdatedEventOf(SessionModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageClientUpdated({
        model: evt._p.model,
        _o: evt._o.clone(),
      }));
    }
  }



  /**
   * @description
   * Fired when a model is deleted
   *
   * @param evt
   */
  @autobind
  @HandleServerEvent(ServerEventModelDeleted)
  private async _handleModelDeleted(evt: ServerEventModelDeleted) {
    this._log.info('Broadcasting ServerEventModelDeleted...', evt._p.CTor.name);

    if (serverModelDeletedEventOf(SessionModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageClientDeleted({
        model: evt._p.model,
        _o: evt._o.clone(),
      }));
    }
  }




  /**
   * @description
   * Fired when a user is logged in
   * 
   * @param evt 
   */
  @autobind
  @HandleServerEvent(ServerEventUserLoggedIn)
  private async _handleClientMessageSignUp(evt: ServerEventUserLoggedIn) {
    this
      ._socketWarehouse
      .findOneOrFail(evt._p.session.socket_id)
      .send(new ServerMessageAuthenticated({
        you: evt._p.user,
        _o: evt._o.clone(),
      }));
  }


  /**
   * @description
   * Fired when a client message is invalid
   * 
   * @param evt 
   */
  @autobind
  @HandleServerEvent(ServerEventSocketClientMessageInvalid)
  private async _handleClientMessageInvalid(evt: ServerEventSocketClientMessageInvalid) {
    evt
      ._p
      .socket
      .send(new ServerMessageClientMessageInvalid({
        _o: evt._o.clone(),
        errors: evt._p.errs,
        messageType: evt._p.Ctor._t,
      }));
  }


  /**
   * @description
   * Fired when a client message is malformed
   *
   * @param evt
   */
  @autobind
  @HandleServerEvent(ServerEventSocketClientMessageMalformed)
  private async _handleClientMessageMalformed(evt: ServerEventSocketClientMessageMalformed) {
    evt
      ._p
      .socket
      .send(new ServerMessageClientMessageMalformed({
        _o: evt._o.clone(),
        error: evt._p.err,
      }));
  }


  /**
   * @description
   * Fired when a ClientModel is updated
   *
   * @param evt
   */
  @autobind
  @HandleServerModelCreatedEvent(SessionModel)
  private async _handleClientCreated(evt: ServerEventModelCreated<SessionModel>) {
    this._log.info('initialising client');
    const [
      chats,
      users,
      clients,
    ] = await Promise.all([
      this._chatRepo.findAll(),
      this._userRepo.findAll(),
      this._sessionRepo.findAll(),
    ]);
    const socket = this._socketWarehouse.findOneOrFail(evt._p.model.socket_id);
    const initMessage = new ServerMessageInit({
      clients: clients.filter(model => model.deleted_at === null),
      chats: chats.filter(model => model.deleted_at === null),
      users: users.filter(model => model.deleted_at === null),
      _o: evt._o.clone(),
    });
    socket.send(initMessage);
  }
}