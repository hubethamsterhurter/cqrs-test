import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { ChatRepository } from "../chat/chat.repository";
import { UserRepository } from "../user/user.repository";
import { InitSmo, InitSmDto } from "../../../shared/smo/init.smo";
import { ModelCreatedSeo } from "../../events/models/model-created.seo";
import { ModelUpdatedSeo } from "../../events/models/model-updated.seo";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { ModelDeletedSeo } from "../../events/models/model-deleted.seo";
import { UserLoggedInSeo } from "../../events/models/user.logged-in.seo";
import { HandleSeModelCreated } from "../../decorators/handle-se-model-created.decorator";
import { HandleSe } from "../../decorators/handle-ce.decorator";
import { SessionService } from "./session.auth.service";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { SCMessageInvalidSeo } from "../../events/models/sc.message-invalid.seo";
import { CmInvalidSmo, CmInvalidSmDto } from "../../../shared/smo/cm.invalid.smo";
import { SCMessageMalformedSeo } from "../../events/models/sc.message-errored.seo";
import { CMMalformedSmo, CmMalformedSmDto } from "../../../shared/smo/cm.malformed.smo";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { AppHeartbeatSeo } from "../../events/models/app-heartbeat.seo";
import { ServerHeartbeatSmo } from "../../../shared/smo/server-heartbeat.smo";
import { UserLoggedOutSeo } from "../../events/models/user.logged-out.seo";
import { LoggedOutSmo, LoggedOutSmDto } from "../../../shared/domains/session/smo/logged-out.smo";
import { ModelUpdatedSmo, ModelUpdatedSmDto } from "../../../shared/smo/mode.updated.smo";
import { ctorName } from "../../../shared/helpers/ctor-name.helper";
import { ModelCreatedSmo, ModelCreatedSmDto } from "../../../shared/smo/model.created.smo";
import { ModelDeletedSmo, ModelDeletedSmDto } from "../../../shared/smo/model.deleted.smo";
import { AuthenticatedSmo, AuthenticatedSmDto } from "../../../shared/domains/session/smo/authenticated.smo";



let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
export class SessionBroadcaster {
  private readonly _log = new Logger(this);

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
  @HandleSe(AppHeartbeatSeo)
  private async _testInvalidMessageHandleAppHeartbeat(evt: AppHeartbeatSeo) {
    // TESTING ERROR
    this._socketWarehouse.broadcastAll(new ServerHeartbeatSmo({ trace: evt.trace.clone(), at: 'hi :)' as any, } as any));
  }



  /**
   * TODO: remove test
   *
   * @description
   * Fired on app heartbeat
   * 
   * @param evt 
   */
  @HandleSe(AppHeartbeatSeo)
  private async _testMalformedMessageHandleAppHeartbeat(evt: AppHeartbeatSeo) {
    // TESTING ERROR
    this._socketWarehouse.broadcastAll({ hello: 'world' } as any);
  }


  /**
   * @description
   * Fired when a model is created
   *
   * @param evt
   */
  @HandleSe(ModelCreatedSeo)
  private async _handleModelCreated(evt: ModelCreatedSeo) {
    this._socketWarehouse.broadcastAll(new ModelCreatedSmo({
      dto: new ModelCreatedSmDto({
        CtorName: ctorName(evt.dto.model),
        model: evt.dto.model,
      }),
      trace: evt.trace.clone(),
    }));
  }



  /**
   * @description
   * Fired when a model is updated
   *
   * @param evt
   */
  @HandleSe(ModelUpdatedSeo)
  private async _handleModelUpdated(evt: ModelUpdatedSeo) {
    this._socketWarehouse.broadcastAll(new ModelUpdatedSmo({
      dto: new ModelUpdatedSmDto({
        CtorName: ctorName(evt.dto.model),
        model: evt.dto.model,
      }),
      trace: evt.trace.clone(),
    }));
  }



  /**
   * @description
   * Fired when a model is deleted
   *
   * @param evt
   */
  @HandleSe(ModelDeletedSeo)
  private async _handleModelDeleted(evt: ModelDeletedSeo) {
    this._socketWarehouse.broadcastAll(new ModelDeletedSmo({
      dto: new ModelDeletedSmDto({
        CtorName: ctorName(evt.dto.model),
        model: evt.dto.model,
      }),
      trace: evt.trace.clone(),
    }));
  }




  /**
   * @description
   * Fired when a user is logged in
   * 
   * @param evt 
   */
  @HandleSe(UserLoggedInSeo)
  private async _handleClientMessageSignUp(evt: UserLoggedInSeo) {
    this
      ._socketWarehouse
      .findOneOrFail(evt.dto.session.socket_id)
      .send(new AuthenticatedSmo({
        dto: new AuthenticatedSmDto({
          token: evt.dto.authToken,
          you: evt.dto.user,
        }),
        trace: evt.trace.clone(),
      }));
  }



  /**
   * @description
   * Fired when a client message is invalid
   * 
   * @param evt 
   */
  @HandleSe(SCMessageInvalidSeo)
  private async _handleClientMessageInvalid(evt: SCMessageInvalidSeo) {
    evt
      .dto
      .socket
      .send(new CmInvalidSmo({
        dto: new CmInvalidSmDto({
          errors: evt.dto.errs,
          MessageCtorName: evt.dto.MessageCtor.name,
        }),
        trace: evt.trace.clone(),
      }));
  }


  /**
   * @description
   * Fired when a client message is malformed
   *
   * @param evt
   */
  @HandleSe(SCMessageMalformedSeo)
  private async _handleClientMessageMalformed(evt: SCMessageMalformedSeo) {
    evt
      .dto
      .socket
      .send(new CMMalformedSmo({
        dto: new CmMalformedSmDto({
          error: evt.dto.err,
        }),
        trace: evt.trace.clone(),
      }));
  }


  /**
   * @description
   * Fired when a ClientModel is updated
   *
   * @param evt
   */
  @HandleSeModelCreated(SessionModel)
  private async _handleClientCreated(evt: ModelCreatedSeo<SessionModel>) {
    this._log.info('initialising client');
    const [
      chats,
      users,
      sessions,
    ] = await Promise.all([
      this._chatRepo.findAll(),
      this._userRepo.findAll(),
      this._sessionRepo.findAll(),
    ]);
    const socket = this._socketWarehouse.findOneOrFail(evt.dto.model.socket_id);
    const initMessage = new InitSmo({
      dto: new InitSmDto({
        sessions: sessions.filter(model => model.deleted_at === null),
        chats: chats.filter(model => model.deleted_at === null),
        users: users.filter(model => model.deleted_at === null),
      }),
      trace: evt.trace.clone(),
    });
    socket.send(initMessage);
  }


  /**
   * @description
   * Fired when a ClientModel is updated
   *
   * @param evt
   */
  @HandleSe(UserLoggedOutSeo)
  private async _handleUserLoggedOut(evt: UserLoggedOutSeo) {
    const socket = this._socketWarehouse.findOne(evt.dto.session.socket_id);
    if (socket) {
      socket.send(new LoggedOutSmo({
        dto: new LoggedOutSmDto({
          deletedReauthTokenId: evt.dto.token.id,
        }),
        trace: evt.trace.clone(),
      }));
    }
  }
}