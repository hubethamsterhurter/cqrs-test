import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserModel } from "../../../shared/domains/user/user.model";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { SSConnectionSeo } from "../../events/models/ss.connection.seo";
import { SCCloseSeo } from "../../events/models/sc.close.seo";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { UserSignedUpSeo } from "../../events/models/user.signed-up.seo";
import { SocketClientFactory } from "../../global/socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { UserLoggedInSeo, UserLoggedInSeDto } from "../../events/models/user.logged-in.seo";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { HandleSe } from "../../decorators/handle-ce.decorator";
import { UserLoggedOutSeo, UserLoggedOutSeDto } from "../../events/models/user.logged-out.seo";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { SEConsumer } from "../../decorators/se-consumer.decorator";
import { ReauthSessionTokenService } from "../auth-token/reauth-session-token.service";
import { UserRepository } from "../user/user.repository";
import { ReauthSessionTokenRepository } from "../auth-token/reauth-session-token.repository";


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@SEConsumer()
export class SessionService {
  private readonly _log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _sessionRepo
   * @param _wscFactory
   * @param _idFactory
   * @param _socketWarehouse
   */
  constructor(
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
    @Inject(() => SocketClientFactory) private readonly _wscFactory: SocketClientFactory,
    @Inject(() => ReauthSessionTokenService) private readonly _reauthTokenService: ReauthSessionTokenService,
    @Inject(() => IdFactory) private readonly _idFactory: IdFactory,
    @Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => ReauthSessionTokenRepository) private readonly _reauthTokenRepo: ReauthSessionTokenRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Log a user session in
   *
   * @param session
   * @param user
   * @param requester
   * @param trace
   */
  async authenticate(
    session: SessionModel,
    user: UserModel,
    requester: UserModel | null,
    trace: Trace,
  ): Promise<void> {
    session.user_id = user.id;
    session = await this._sessionRepo.upsert(session, requester, trace);
    const authToken = await this._reauthTokenService.create(
      {
        user: user,
        session: session,
        expires_at: null,
      },
      trace,
    );
    this._eb.fire(new UserLoggedInSeo({
      dto: new UserLoggedInSeDto({
        authToken: authToken,
        session: session,
        user: user,
      }),
      trace: trace.clone(),
    }));
  }



  /**
   * @description
   * Log a user session out
   *
   * @param session
   * @param trace
   */
  async logout(
    session: SessionModel,
    trace: Trace,
  ): Promise<void> {
    if (!session.user_id) {
      this._log.info('Cannot log out session without a user_id');
      return;
    }

    const [
      user,
      token,
    ] =  await Promise.all([
      this._userRepo.findOneOrFail(session.user_id),
      this._reauthTokenRepo.findOrFailByOriginalSessionId(session.id),
    ]);

    this._eb.fire(new UserLoggedOutSeo({
      dto: new UserLoggedOutSeDto({
        session,
        token,
        user,
      }),
      trace: trace.clone(),
    }));
  }



  /**
   * @description
   * Delete a session
   *
   * @param session
   * @param requester
   * @param trace
   */
  async delete(
    session: SessionModel,
    requester: UserModel,
    trace: Trace,
  ): Promise<SessionModel | null> {
    return await this._sessionRepo.delete(session, requester, trace);
  }



  /**
   * @description
   * Fired when a socket connects to the server
   *
   * @param evt
   */
  @HandleSe(SSConnectionSeo)
  private async _handleSCConnection(evt: SSConnectionSeo) {
    // create a "client" for the socket
    this._log.info('socket connected');
    const clientId = this._idFactory.create();
    const clientSocket = this._wscFactory.create({
      id: this._idFactory.create(),
      client_id: clientId,
      rawWebSocket: evt.dto.rawWebSocket,
    })
    this._socketWarehouse.add(clientSocket);
    const rawClient: UnsavedModel<SessionModel> = {
      user_id: null,
      socket_id: clientSocket.id,
      connected_at: new Date(),
      disconnected_at: null,
    }
    await this._sessionRepo.create(
      rawClient,
      clientId,
      null,
      evt.trace
    );
  }



  /**
   * @description
   * Fired when a socket client disconnects
   * 
   * @param evt 
   */
  @HandleSe(SCCloseSeo)
  private async _handleSCCClose(evt: SCCloseSeo) {
    this._log.info(`Removing closed socket ${evt.dto.socket.id} (code: "${evt.dto.code}", reason: "${evt.dto.reason}")`);
    const session = await this._sessionRepo.findOneOrFail(evt.dto.socket.session_id);
    return await this._sessionRepo.delete(session, null, evt.trace);
  }




  /**
   * @description
   * Fired when a user signs up
   * 
   * @param evt 
   */
  @HandleSe(UserSignedUpSeo)
  private async _handleClientMessageSignUp(evt: UserSignedUpSeo) {
    await this.authenticate(evt.dto.session, evt.dto.user, null, evt.trace);
  }
}
