import ws from 'ws';
import { Service } from "typedi";
import { ServerEventBus } from '../../global/event-bus/server-event-bus';
import { WSS_EVENT } from '../../constants/wss.event';
import { ServerEventStream } from '../../global/event-stream/server-event-stream';
import { SSCloseSeo, SSCloseSeDto } from '../../events/models/ss.close.seo';
import { SSConnectionSeo, SSConnectionSeDto } from '../../events/models/ss.connection.seo';
import { SSErrorSeo, SSErrorSeDto } from '../../events/models/ss.error.seo';
import { SSListeningSeo, SSListeningSeDto } from '../../events/models/ss.listening.seo';
import { SSHeadersSeo, SSHeadersSeDto } from '../../events/models/ss.headers.seo';
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
      this._eb.fire(new SSCloseSeo({
        dto: new SSCloseSeDto({}),
        trace: new Trace(),
      }));
    });

    // connection
    this._wss.on(WSS_EVENT.CONNECTION, async (socket, req) => {
      this._eb.fire(new SSConnectionSeo({
        dto: new SSConnectionSeDto({
          req,
          rawWebSocket: socket,
        }),
        trace: new Trace(),
      }));
    });

    // error
    this._wss.on(WSS_EVENT.ERROR, (err) => {
      this._eb.fire(new SSErrorSeo({
        dto: new SSErrorSeDto({
          err,
        }),
        trace: new Trace(),
      }));
    });

    // headers
    this._wss.on(WSS_EVENT.HEADERS, (headers, req) => {
      this._eb.fire(new SSHeadersSeo({
        dto: new SSHeadersSeDto({
          headers,
          req,
        }),
        trace: new Trace(),
      }));
    });

    // listening
    this._wss.on(WSS_EVENT.LISTENING, () => {
      this._eb.fire(new SSListeningSeo({
        dto: new SSListeningSeDto({}),
        trace: new Trace(),
      }));
    });
  }
}

