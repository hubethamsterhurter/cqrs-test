import ws from 'ws';
import { Service } from "typedi";
import { ServerEventBus } from '../event-bus/server-event-bus';
import { WSS_EVENT } from '../../constants/wss.event';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { ServerEventSocketServerClose } from '../../events/models/server-event.socket-server.close';
import { ServerEventSocketServerConnection } from '../../events/models/server-event.socket-server.connection';
import { ServerEventSocketServerError } from '../../events/models/server-event.socket-server.error';
import { ServerEventSocketServerListening } from '../../events/models/server-event.socket-server.listening';
import { SocketClientFactory } from '../socket-client/socket-client.factory';
import { IdFactory } from '../../../shared/helpers/id.factory';
import { ServerEventSocketServerHeaders } from '../../events/models/server-event.socket-server.headers';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SocketServer {
  /**
   * @constructor
   *
   * @param _wss
   * @param _eb
   * @param _es
   * @param _wscFactory
   * @param _idFactory
   */
  constructor(
    private _wss: ws.Server,
    private _eb: ServerEventBus,
    private _es: ServerEventStream,
    private _wscFactory: SocketClientFactory,
    private _idFactory: IdFactory,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // close
    this._wss.on(WSS_EVENT.CLOSE, () => {
      this._eb.fire(new ServerEventSocketServerClose());
    });

    // connection
    this._wss.on(WSS_EVENT.CONNECTION, (socket, req) => {
      const wsc = this._wscFactory.create({ socket, uuid: this._idFactory.create(), connected_at: new Date(), });
      this._eb.fire(new ServerEventSocketServerConnection({ req, wsc }));
    });

    // error
    this._wss.on(WSS_EVENT.ERROR, (err) => {
      this._eb.fire(new ServerEventSocketServerError({ err }));
    });

    // headers
    this._wss.on(WSS_EVENT.HEADERS, (headers, req) => {
      this._eb.fire(new ServerEventSocketServerHeaders({ headers, req }));
    });

    // listening
    this._wss.on(WSS_EVENT.LISTENING, () => {
      this._eb.fire(new ServerEventSocketServerListening());
    });
  }
}

