import ws from 'ws';
import { Service } from "typedi";
import { ServerEventBus } from '../event-bus/server-event-bus';
import { WSS_EVENT } from '../../constants/wss.event';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { SocketServerCloseSeo } from '../../events/models/socket-server.close.seo';
import { SocketServerConnectionSeo } from '../../events/models/socket-server.connection.seo';
import { SocketServerErrorSeo } from '../../events/models/socket-server.error.seo';
import { SocketServerListeningSeo } from '../../events/models/socket-server.listening.seo';
import { SocketServerHeadersSeo } from '../../events/models/socket-server.headers.seo';
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
      this._eb.fire(new SocketServerCloseSeo({
        _p: undefined,
        _o: new Trace(),
      }));
    });

    // connection
    this._wss.on(WSS_EVENT.CONNECTION, (socket, req) => {
      this._eb.fire(new SocketServerConnectionSeo({
        _p: {
          req,
          rawWebSocket: socket,
        },
        _o: new Trace(),
      }));
    });

    // error
    this._wss.on(WSS_EVENT.ERROR, (err) => {
      this._eb.fire(new SocketServerErrorSeo({
        _p: {
          err,
        },
        _o: new Trace(),
      }));
    });

    // headers
    this._wss.on(WSS_EVENT.HEADERS, (headers, req) => {
      this._eb.fire(new SocketServerHeadersSeo({
        _p: {
          headers,
          req,
        },
        _o: new Trace(),
      }));
    });

    // listening
    this._wss.on(WSS_EVENT.LISTENING, () => {
      this._eb.fire(new SocketServerListeningSeo({
        _p: undefined,
        _o: new Trace(),
      }));
    });
  }
}

