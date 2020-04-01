import ws from 'ws';
import { ServerEventBus } from '../event-bus/server-event-bus';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { WS_EVENT } from '../../constants/ws.event';
import { SCCloseSeo, SCCloseSeDto } from '../../events/models/sc.close.seo';
import { SCErrorSeo, SCErrorSeDto } from '../../events/models/sc.error.seo';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { SCMessageInvalidSeo, SCMessageInvalidSeDto } from '../../events/models/sc.message-invalid.seo';
import { SCMessageMalformedSeo, SCMessageMalformedSeDto } from '../../events/models/sc.message-errored.seo';
import { SCOpenSeo } from '../../events/models/sc.open.seo';
import { SCUnexpectedResponseSeo } from '../../events/models/sc.unexpected-response.seo';
import { SCUpgradeSeo } from '../../events/models/sc.upgrade.seo';
import { SCPongSeo } from '../../events/models/sc.pong.seo';
import { SCPingSeo } from '../../events/models/sc.ping.seo';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { Trace } from '../../../shared/helpers/Tracking.helper';




@LogConstruction()
export class SocketClient {
  private _log = new Logger(this);

  /**
   * @constructor
   * 
   * @param id
   * @param connected_at
   * @param _ws
   * @param _eb
   * @param _es
   * @param _parser
   * @param _sWarehouse
   */
  constructor(
    readonly id: string,
    readonly session_id: string,
    private readonly _ws: ws,
    private readonly _eb: ServerEventBus,
    private readonly _es: ServerEventStream,
  ) {
    // emissions

    // close
    this._ws.on(WS_EVENT.CLOSE, async (code, reason) => {
      this._eb.fire(new SCCloseSeo({
        dto: new SCCloseSeDto({
          socket: this,
          code,
          reason,
        }),
        trace: new Trace(),
      }));
    });

    // error
    this._ws.on(WS_EVENT.ERROR, async (err) => {
      this._eb.fire(new SCErrorSeo({
        dto: new SCErrorSeDto({
          socket: this,
          err: err,
        }),
        trace: new Trace(),
      }));
    });

    // message
    this._ws.on(WS_EVENT.MESSAGE, async (data) => {
      const result = this._parser.fromString(data.toString());

      if (result.malformed()) {
        // message -> malformed
        this._eb.fire(new SCMessageMalformedSeo({
          dto: new SCMessageMalformedSeDto({
            socket: this,
            err: result._u.err,
          }),
          trace: new Trace(),
        }));
      }

      else if (result.invalid()) {
        // message -> invalid
        this._eb.fire(new SCMessageInvalidSeo({
          dto: new SCMessageInvalidSeDto({
            socket: this,
            errs: result._u.errs,
            MessageCtor: result,
            // Ctor: result._u.Ctor,
          }),
          trace: result._u.trace?.clone() ?? new Trace(),
        }));
      }

      else if (result.success()) {
        // message -> success

        this._eb.fire(new SCMessageSeo({
          _p: {
            socket: this,
            message: result._u.instance,
            Ctor: result._u.Ctor,
          },
          trace: result._u.instance.trace.clone(),
        }));
      }
    });

    // open
    this._ws.on(WS_EVENT.OPEN, async () => {
      this._eb.fire(new SCOpenSeo({
        _p: {
          socket: this,
        },
        trace: new Trace(),
      }));
    });

    // ping
    this._ws.on(WS_EVENT.PING, async () => {
      this._eb.fire(new SCPingSeo({
        _p: {
          socket: this,
        },
        trace: new Trace(),
      }));
    });

    // pong
    this._ws.on(WS_EVENT.PONG, async () => {
      this._eb.fire(new SCPongSeo({
        _p: {
          socket: this
        },
        trace: new Trace(),
      }));
    });

    // upgrade
    this._ws.on(WS_EVENT.UGPRADE, async () => {
      this._eb.fire(new SCUpgradeSeo({
        _p: {
          socket: this,
        },
        trace: new Trace(),
      }));
    });

    // unexpected response
    this._ws.on(WS_EVENT.UNEXPECTED_RESPONSE, async () => {
      this._eb.fire(new SCUnexpectedResponseSeo({
        _p: {
          socket: this,
        },
        trace: new Trace(),
      }));
    });

    // listeners
    // TODO
  }


  /**
   * @description
   * Send a message to the client
   *
   * @param msg 
   */
  send(msg: ServerMessage) {
    const strMsg = JSON.stringify(msg);
    this._log.info(`-> \t SENDING MESSAGE \t -> \t ${msg?.constructor?.name?.padEnd(25, ' ')} \t -> \t ${msg?.trace?.origin_id}`);
    this._ws.send(strMsg);
  }
}
