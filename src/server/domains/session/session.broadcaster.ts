import { Service, Inject } from "typedi";
import { UserModel } from "../../../shared/domains/user/user.model";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { ChatRepository } from "../chat/chat.repository";
import { UserRepository } from "../user/user.repository";
import { ServerMessageInit } from "../../../shared/message-server/models/server-message.init";
import { ModelCreatedSeo } from "../../events/models/model-created.seo";
import { ModelUpdatedSeo } from "../../events/models/model-updated.seo";
import { serverModelCreatedEventOf, serverModelUpdatedEventOf, serverModelDeletedEventOf } from "../../helpers/server-model-event-filter.helper";
import { ServerMessageUserCreated } from "../../../shared/message-server/models/server-message.user.created";
import { ServerMessageChatCreated } from "../../../shared/message-server/models/server-message.chat.created";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { ServerMessageUserUpdated } from "../../../shared/message-server/models/server-message.user.updated";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { ServerMessageSessionCreated } from "../../../shared/message-server/models/server-message.session.created";
import { ServerMessageSessionUpdated } from "../../../shared/message-server/models/server-message.session.updated";
import { ModelDeletedSeo } from "../../events/models/model-deleted.seo";
import { ServerMessageSessionDeleted } from "../../../shared/message-server/models/server-message.session.deleted";
import { ServerMessageAuthenticated } from "../../../shared/message-server/models/server-message.authenticated";
import { UserLoggedInSeo } from "../../events/models/user.logged-in.seo";
import { HandleServerModelCreatedEvent } from "../../decorators/handle-server-model-created-event.decorator";
import { HandleServerEvent } from "../../decorators/handle-server-event.decorator";
import { SessionService } from "./session.service";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { SCMessageInvalidSeo } from "../../events/models/sc.message-invalid.seo";
import { ServerMessageClientMessageInvalid } from "../../../shared/message-server/models/server-message.client-message-invalid";
import { SCMessageMalformedSeo } from "../../events/models/sc.message-errored.seo";
import { ServerMessageClientMessageMalformed } from "../../../shared/message-server/models/server-message.client-message-malformed";
import { ServerEventConsumer } from "../../decorators/server-event-consumer.decorator";
import { AppHeartbeatSeo } from "../../events/models/app-heartbeat.seo";
import { ServerMessageServerHeartbeat } from "../../../shared/message-server/models/server-message.server-heartbeat";



let __created__ = false;
@Service({ global: true })
@LogConstruction()
@ServerEventConsumer()
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
   * TODO: remove test
   *
   * @description
   * Fired on app heartbeat
   * 
   * @param evt 
   */
  @HandleServerEvent(AppHeartbeatSeo)
  private async _testInvalidMessageHandleAppHeartbeat(evt: AppHeartbeatSeo) {
    this._socketWarehouse.broadcastAll(new ServerMessageServerHeartbeat({
      trace: evt.trace.clone(),
      // TESTING ERROR
      at: 'hi :)' as any,
    }));
  }



  /**
   * TODO: remove test
   *
   * @description
   * Fired on app heartbeat
   * 
   * @param evt 
   */
  @HandleServerEvent(AppHeartbeatSeo)
  private async _testMalformedMessageHandleAppHeartbeat(evt: AppHeartbeatSeo) {
    this._socketWarehouse.broadcastAll({ hello: 'world' } as any);
  }


  /**
   * @description
   * Fired when a model is created
   *
   * @param evt
   */
  @HandleServerEvent(ModelCreatedSeo)
  private async _handleModelCreated(evt: ModelCreatedSeo) {
    this._log.info('Broadcasting ServerEventModelCreated...', evt._p.CTor.name);

    if (serverModelCreatedEventOf(UserModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageUserCreated({
        model: evt._p.model,
        trace: evt.trace.clone(),
      }));
    }

    else if (serverModelCreatedEventOf(ChatModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageChatCreated({
        model: evt._p.model,
        trace: evt.trace.clone(),
      }));
    }

    else if (serverModelCreatedEventOf(SessionModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageSessionCreated({
        model: evt._p.model,
        trace: evt.trace.clone(),
      }));
    }
  }



  /**
   * @description
   * Fired when a model is updated
   *
   * @param evt
   */
  @HandleServerEvent(ModelUpdatedSeo)
  private async _handleModelUpdated(evt: ModelUpdatedSeo) {
    this._log.info('Broadcasting ServerEventModelUpdated...', evt._p.CTor.name);

    if (serverModelUpdatedEventOf(UserModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageUserUpdated({
        model: evt._p.model,
        trace: evt.trace.clone(),
      }));
    }

    else if (serverModelUpdatedEventOf(SessionModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageSessionUpdated({
        model: evt._p.model,
        trace: evt.trace.clone(),
      }));
    }
  }



  /**
   * @description
   * Fired when a model is deleted
   *
   * @param evt
   */
  @HandleServerEvent(ModelDeletedSeo)
  private async _handleModelDeleted(evt: ModelDeletedSeo) {
    this._log.info('Broadcasting ServerEventModelDeleted...', evt._p.CTor.name);

    if (serverModelDeletedEventOf(SessionModel)(evt)) {
      this._socketWarehouse.broadcastAll(new ServerMessageSessionDeleted({
        model: evt._p.model,
        trace: evt.trace.clone(),
      }));
    }
  }




  /**
   * @description
   * Fired when a user is logged in
   * 
   * @param evt 
   */
  @HandleServerEvent(UserLoggedInSeo)
  private async _handleClientMessageSignUp(evt: UserLoggedInSeo) {
    this
      ._socketWarehouse
      .findOneOrFail(evt._p.session.socket_id)
      .send(new ServerMessageAuthenticated({
        you: evt._p.user,
        trace: evt.trace.clone(),
      }));
  }


  /**
   * @description
   * Fired when a client message is invalid
   * 
   * @param evt 
   */
  @HandleServerEvent(SCMessageInvalidSeo)
  private async _handleClientMessageInvalid(evt: SCMessageInvalidSeo) {
    evt
      ._p
      .socket
      .send(new ServerMessageClientMessageInvalid({
        trace: evt.trace.clone(),
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
  @HandleServerEvent(SCMessageMalformedSeo)
  private async _handleClientMessageMalformed(evt: SCMessageMalformedSeo) {
    evt
      ._p
      .socket
      .send(new ServerMessageClientMessageMalformed({
        trace: evt.trace.clone(),
        error: evt._p.err,
      }));
  }


  /**
   * @description
   * Fired when a ClientModel is updated
   *
   * @param evt
   */
  @HandleServerModelCreatedEvent(SessionModel)
  private async _handleClientCreated(evt: ModelCreatedSeo<SessionModel>) {
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
      sessions: clients.filter(model => model.deleted_at === null),
      chats: chats.filter(model => model.deleted_at === null),
      users: users.filter(model => model.deleted_at === null),
      trace: evt.trace.clone(),
    });
    socket.send(initMessage);
  }
}