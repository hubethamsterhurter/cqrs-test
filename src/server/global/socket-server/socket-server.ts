import ws from 'ws';
import { Service } from "typedi";
import { ServerEventBus } from '../event-bus/server-event-bus';
import { WSS_EVENT } from '../../constants/wss.event';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { ServerEventSocketServerClose } from '../../events/models/server-event.socket-server.close';
import { ServerEventSocketServerConnection } from '../../events/models/server-event.socket-server.connection';
import { ServerEventSocketServerError } from '../../events/models/server-event.socket-server.error';
import { ServerEventSocketServerListening } from '../../events/models/server-event.socket-server.listening';
import { ServerEventSocketServerHeaders } from '../../events/models/server-event.socket-server.headers';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { Trace } from '../../../shared/helpers/Tracking.helper';


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
   */
  constructor(
    private _wss: ws.Server,
    private _eb: ServerEventBus,
    private _es: ServerEventStream,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // close
    this._wss.on(WSS_EVENT.CLOSE, () => {
      this._eb.fire(new ServerEventSocketServerClose({
        _p: undefined,
        _o: new Trace(),
      }));
    });

    // connection
    this._wss.on(WSS_EVENT.CONNECTION, (socket, req) => {
      this._eb.fire(new ServerEventSocketServerConnection({
        _p: {
          req,
          rawWebSocket: socket,
        },
        _o: new Trace(),
      }));
    });

    // error
    this._wss.on(WSS_EVENT.ERROR, (err) => {
      this._eb.fire(new ServerEventSocketServerError({
        _p: {
          err,
        },
        _o: new Trace(),
      }));
    });

    // headers
    this._wss.on(WSS_EVENT.HEADERS, (headers, req) => {
      this._eb.fire(new ServerEventSocketServerHeaders({
        _p: {
          headers,
          req,
        },
        _o: new Trace(),
      }));
    });

    // listening
    this._wss.on(WSS_EVENT.LISTENING, () => {
      this._eb.fire(new ServerEventSocketServerListening({
        _p: undefined,
        _o: new Trace(),
      }));
    });
  }
}

