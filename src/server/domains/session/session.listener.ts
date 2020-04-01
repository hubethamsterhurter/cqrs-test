import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { SSConnectionSeo } from "../../events/models/ss.connection.seo";
import { SCCloseSeo } from "../../events/models/sc.close.seo";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { UserSignedUpSeo } from "../../events/models/user.signed-up.seo";
import { SocketClientFactory } from "../../global/socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { HandleSe } from "../../decorators/handle-ce.decorator";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { SessionService } from "./session.auth.service";


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@SeConsumer()
export class SessionListener {
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
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
    @Inject(() => SocketClientFactory) private readonly _wscFactory: SocketClientFactory,
    @Inject(() => IdFactory) private readonly _idFactory: IdFactory,
    @Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse,
    @Inject(() => SessionService) private readonly _sessionService: SessionService,
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
  @HandleSe(SSConnectionSeo)
  private async _handleSCConnection(evt: SSConnectionSeo) {
    // create a "client" for the socket
    this._log.info('socket connected');
    const sessionId = this._idFactory.create();
    const socket = this._wscFactory.create({
      id: this._idFactory.create(),
      client_id: sessionId,
      rawWebSocket: evt.dto.rawWebSocket,
    })
    this._socketWarehouse.add(socket);
    const raw: UnsavedModel<SessionModel> = {
      user_id: null,
      socket_id: socket.id,
      connected_at: new Date(),
      disconnected_at: null,
    }
    await this._sessionRepo.create({
      inModel: raw,
      forceId: undefined,
      requester: null,
      trace: evt.trace,
    });
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
    const session = await this._sessionRepo.findOneOrFail({ id: evt.dto.socket.session_id });
    return await this._sessionRepo.delete({
      inModel: session,
      requester: null,
      trace: evt.trace,
    });
  }




  /**
   * @description
   * Fired when a user signs up
   * 
   * @param evt 
   */
  @HandleSe(UserSignedUpSeo)
  private async _handleClientMessageSignUp(evt: UserSignedUpSeo) {
    await this._sessionService.authenticate({
      session: evt.dto.session,
      user: evt.dto.user,
      requester: evt.dto.user,
      trace: evt.trace,
    });
  }
}
