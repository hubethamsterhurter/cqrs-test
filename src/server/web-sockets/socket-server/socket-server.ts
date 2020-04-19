import ws from 'ws';
import { Service } from "typedi";
import { EventBus } from '../../global/event-bus/event-bus';
import { WSS_EVENT } from '../../constants/wss.event';
import { EventStream } from '../../global/event-stream/event-stream';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { SSCloseEvent } from '../../events/event.ss.close';
import { createEvent } from '../../helpers/create-event.helper';
import { SSConnectionEvent } from '../../events/event.ss.connection';
import { SSErrorEvent } from '../../events/event.ss.error';
import { SSHeadersEvent } from '../../events/event.ss.headers';
import { SSListeningEvent } from '../../events/event.ss.listening';


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
    private _eb: EventBus,
    private _es: EventStream,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // close
    this._wss.on(WSS_EVENT.CLOSE, () => {
      this._eb.fire(createEvent(SSCloseEvent, {
        trace: new Trace(),
      }));
    });

    // connection
    this._wss.on(WSS_EVENT.CONNECTION, async (socket, req) => {
      this._eb.fire(createEvent(SSConnectionEvent, {
        req,
        rawWebSocket: socket,
        trace: new Trace(),
      }));
    });

    // error
    this._wss.on(WSS_EVENT.ERROR, (err) => {
      this._eb.fire(createEvent(SSErrorEvent, {
        err,
        trace: new Trace(),
      }));
    });

    // headers
    this._wss.on(WSS_EVENT.HEADERS, (headers, req) => {
      this._eb.fire(createEvent(SSHeadersEvent, {
        headers,
        req,
        trace: new Trace(),
      }));
    });

    // listening
    this._wss.on(WSS_EVENT.LISTENING, () => {
      this._eb.fire(createEvent(SSListeningEvent, {
        trace: new Trace(),
      }));
    });
  }
}

