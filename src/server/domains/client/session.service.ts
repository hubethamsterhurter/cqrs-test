import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserModel } from "../../../shared/domains/user/user.model";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { ServerEventSocketServerConnection } from "../../events/models/server-event.socket-server.connection";
import { ServerEventSocketClientClose } from "../../events/models/server-event.socket-client.close";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { ServerEventUserSignedUp } from "../../events/models/server-event.user.signed-up";
import { SocketClientFactory } from "../../global/socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventUserLoggedIn } from "../../events/models/server-event.user.logged-in";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { HandleServerEvent } from "../../decorators/handle-server-event.decorator";
import { ServerEventUserLoggedOut } from "../../events/models/server-event.user.logged-out";
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
  @HandleServerEvent(ServerEventSocketServerConnection)
  private async _handleSocketClientConnection(evt: ServerEventSocketServerConnection) {
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
      evt._o
    );
  }



  /**
   * @description
   * Fired when a socket client disconnects
   * 
   * @param evt 
   */
  @HandleServerEvent(ServerEventSocketClientClose)
  private async _handleSocketClientClose(evt: ServerEventSocketClientClose) {
    this._log.info(`Removing closed socket ${evt._p.socket.id} (code: "${evt._p.code}", reason: "${evt._p.reason}")`);
    const client = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._sessionRepo.delete(client, evt._o);
    this._socketWarehouse.remove(evt._p.socket);
  }



  /**
   * @description
   * Fired when a user signs up
   * 
   * @param evt 
   */
  @HandleServerEvent(ServerEventUserSignedUp)
  private async _handleClientMessageSignUp(evt: ServerEventUserSignedUp) {
    this._eb.fire(new ServerEventUserLoggedIn({
      _p: {
        user: evt._p.user,
        session: evt._p.session,
      },
      _o: evt._o.clone(),
    }));
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
    this._eb.fire(new ServerEventUserLoggedIn({
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
    this._eb.fire(new ServerEventUserLoggedOut({
      _p: {
        session,
        user,
      },
      _o: trace.clone(),
    }));
  }
}
