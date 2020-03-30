import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserModel } from "../../../shared/domains/user/user.model";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { SocketServerConnectionSeo } from "../../events/models/socket-server.connection.seo";
import { SocketClientCloseSeo } from "../../events/models/socket-client.close.seo";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { UserSignedUpSeo } from "../../events/models/user.signed-up.seo";
import { SocketClientFactory } from "../../global/socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { UserLoggedInSeo } from "../../events/models/user.logged-in.seo";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { HandleServerEvent } from "../../decorators/handle-server-event.decorator";
import { UserLoggedOutSeo } from "../../events/models/user.logged-out.seo";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { ServerEventConsumer } from "../../decorators/server-event-consumer.decorator";


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@ServerEventConsumer()
export class SessionService {
  private readonly _log = new ClassLogger(this);

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
    @Inject(() => IdFactory) private readonly _idFactory: IdFactory,
    @Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Fired when a socket connects to the server
   *
   * @param evt
   */
  @HandleServerEvent(SocketServerConnectionSeo)
  private async _handleSocketClientConnection(evt: SocketServerConnectionSeo) {
    // create a "client" for the socket
    this._log.info('socket connected', this);
    const clientId = this._idFactory.create();
    const clientSocket = this._wscFactory.create({
      id: this._idFactory.create(),
      client_id: clientId,
      rawWebSocket: evt._p.rawWebSocket,
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
      evt.trace
    );
  }



  /**
   * @description
   * Fired when a socket client disconnects
   * 
   * @param evt 
   */
  @HandleServerEvent(SocketClientCloseSeo)
  private async _handleSocketClientClose(evt: SocketClientCloseSeo) {
    this._log.info(`Removing closed socket ${evt._p.socket.id} (code: "${evt._p.code}", reason: "${evt._p.reason}")`);
    const client = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._sessionRepo.delete(client, evt.trace);
    this._socketWarehouse.remove(evt._p.socket);
  }



  /**
   * @description
   * Fired when a user signs up
   * 
   * @param evt 
   */
  @HandleServerEvent(UserSignedUpSeo)
  private async _handleClientMessageSignUp(evt: UserSignedUpSeo) {
    await this.authenticate(evt._p.session, evt._p.user, evt.trace);
  }




  /**
   * @description
   * Log a user session in
   *
   * @param session
   * @param user
   * @param trace
   */
  async authenticate(
    session: SessionModel,
    user: UserModel,
    trace: Trace,
  ): Promise<void> {
    session.user_id = user.id;
    session = await this._sessionRepo.upsert(session, trace);
    this._eb.fire(new UserLoggedInSeo({
      _p: {
        session,
        user,
      },
      _o: trace.clone(),
    }));
  }



  /**
   * @description
   * Log a user session out
   *
   * @param session
   * @param user
   * @param trace
   */
  async logout(
    session: SessionModel,
    user: UserModel,
    trace: Trace,
  ): Promise<void> {
    session.user_id = null;
    session = await this._sessionRepo.upsert(session, trace);
    this._eb.fire(new UserLoggedOutSeo({
      _p: {
        session,
        user,
      },
      _o: trace.clone(),
    }));
  }
}
