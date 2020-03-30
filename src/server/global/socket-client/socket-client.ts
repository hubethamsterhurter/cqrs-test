import ws from 'ws';
import { ServerEventBus } from '../event-bus/server-event-bus';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { WS_EVENT } from '../../constants/ws.event';
import { SocketClientCloseSeo } from '../../events/models/socket-client.close.seo';
import { SocketClientErrorSeo } from '../../events/models/socket-client.error.seo';
import { SocketClientMessageParsedSeo } from '../../events/models/socket-client.message-parsed.seo';
import { SocketClientMessageInvalidSeo } from '../../events/models/socket-client.message-invalid.seo';
import { SocketClientMessageMalformedSeo } from '../../events/models/socket-client.message-errored.seo';
import { SocketClientOpenSeo } from '../../events/models/socket-client.open.seo';
import { SocketClientUnexpectedResponseSeo } from '../../events/models/socket-client.unexpected-response.seo';
import { SocketClientUpgradeSeo } from '../../events/models/socket-client.upgrade.seo';
import { SocketClientPongSeo } from '../../events/models/socket-client.pong.seo';
import { SocketClientPingSeo } from '../../events/models/socket-client.ping.seo';
import { ServerMessage } from '../../../shared/message-server/modules/server-message-registry';
import { ClientMessageParser } from '../../../shared/message-client/modules/client-message-parser';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { Trace } from '../../../shared/helpers/Tracking.helper';




@LogConstruction()
export class SocketClient {
  private _log = new ClassLogger(this);

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
    private readonly _parser: ClientMessageParser,
  ) {
    // emissions

    // close
    this._ws.on(WS_EVENT.CLOSE, async (code, reason) => {
      this._eb.fire(new SocketClientCloseSeo({
        _p: {
          socket: this,
          code,
          reason,
        },
        _o: new Trace(),
      }));
    });

    // error
    this._ws.on(WS_EVENT.ERROR, async (err) => {
      this._eb.fire(new SocketClientErrorSeo({
        _p: {
          socket: this,
          err,
        },
        _o: new Trace(),
      }));
    });

    // message
    this._ws.on(WS_EVENT.MESSAGE, async (data) => {
      const result = this._parser.fromString(data.toString());

      if (result.malformed()) {
        // message -> malformed

        this._eb.fire(new SocketClientMessageMalformedSeo({
          _p: {
            socket: this,
            err: result._u.err,
          },
          _o: new Trace(),
        }));
      }

      else if (result.invalid()) {
        // message -> invalid

        this._eb.fire(new SocketClientMessageInvalidSeo({
          _p: {
            socket: this,
            errs: result._u.errs,
            Ctor: result._u.Ctor,
          },
          _o: result._u._o?.clone() ?? new Trace(),
        }));
      }

      else if (result.success()) {
        // message -> success

        this._eb.fire(new SocketClientMessageParsedSeo({
          _p: {
            socket: this,
            message: result._u.instance,
            Ctor: result._u.Ctor,
          },
          _o: result._u.instance.trace.clone(),
        }));
      }
    });

    // open
    this._ws.on(WS_EVENT.OPEN, async () => {
      this._eb.fire(new SocketClientOpenSeo({
        _p: {
          socket: this,
        },
        _o: new Trace(),
      }));
    });

    // ping
    this._ws.on(WS_EVENT.PING, async () => {
      this._eb.fire(new SocketClientPingSeo({
        _p: {
          socket: this,
        },
        _o: new Trace(),
      }));
    });

    // pong
    this._ws.on(WS_EVENT.PONG, async () => {
      this._eb.fire(new SocketClientPongSeo({
        _p: {
          socket: this
        },
        _o: new Trace(),
      }));
    });

    // upgrade
    this._ws.on(WS_EVENT.UGPRADE, async () => {
      this._eb.fire(new SocketClientUpgradeSeo({
        _p: {
          socket: this,
        },
        _o: new Trace(),
      }));
    });

    // unexpected response
    this._ws.on(WS_EVENT.UNEXPECTED_RESPONSE, async () => {
      this._eb.fire(new SocketClientUnexpectedResponseSeo({
        _p: {
          socket: this,
        },
        _o: new Trace(),
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
    this._log.info(`Sending Message ${msg.constructor.name} to ${this.id}`);
    this._ws.send(strMsg);
  }
}
