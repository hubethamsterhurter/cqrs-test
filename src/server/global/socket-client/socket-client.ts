import ws from 'ws';
import { ServerEventBus } from '../event-bus/server-event-bus';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { WS_EVENT } from '../../constants/ws.event';
import { ServerEventSocketClientClose } from '../../events/models/server-event.socket-client.close';
import { ServerEventSocketClientError } from '../../events/models/server-event.socket-client.error';
import { ServerEventSocketClientMessageParsed } from '../../events/models/server-event.socket-client.message-parsed';
import { ServerEventSocketClientMessageInvalid } from '../../events/models/server-event.socket-client.message-invalid';
import { ServerEventSocketClientMessageMalformed } from '../../events/models/server-event.socket-client.message-errored';
import { ServerEventSocketClientOpen } from '../../events/models/server-event.socket-client.open';
import { ServerEventSocketClientUnexpectedResponse } from '../../events/models/server-event.socket-client.unexpected-response';
import { ServerEventSocketClientUpgrade } from '../../events/models/server-event.socket-client.upgrade';
import { ServerEventSocketClientPong } from '../../events/models/server-event.socket-client.pong';
import { ServerEventSocketClientPing } from '../../events/models/server-event.socket-client.ping';
import { ServerMessage } from '../../../shared/message-server/modules/server-message-registry';
import { ClientMessageParser } from '../../../shared/message-client/modules/client-message-parser';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';




export class SocketClient {
  private _log = new ClassLogger(this);

  /**
   * @constructor
   * 
   * @param uuid
   * @param connected_at
   * @param _ws
   * @param _eb
   * @param _es
   * @param _parser
   * @param _sWarehouse
   */
  constructor(
    readonly uuid: string,
    readonly connected_at: Date,
    private readonly _ws: ws,
    private readonly _eb: ServerEventBus,
    private readonly _es: ServerEventStream,
    private readonly _parser: ClientMessageParser,
  ) {
    // emissions

    // close
    this._ws.on(WS_EVENT.CLOSE, (code, reason) => {
      this._eb.fire(new ServerEventSocketClientClose({ client: this, code, reason }));
    });

    // error
    this._ws.on(WS_EVENT.ERROR, (err) => {
      this._eb.fire(new ServerEventSocketClientError({ client: this, err }));
    });

    // message
    this._ws.on(WS_EVENT.MESSAGE, (data) => {
      const result = this._parser.fromString(data.toString());

      if (result.status === 'malformed') {
        this._eb.fire(new ServerEventSocketClientMessageMalformed({ client: this, err: result.err, }));
      }

      else if (result.status === 'invalid') {
        this._eb.fire(new ServerEventSocketClientMessageInvalid({ client: this, errs: result.errs, Ctor: result.Ctor, }));
      }

      else if (result.status === 'success') {
        this._eb.fire(new ServerEventSocketClientMessageParsed({ client: this, message: result.message, Ctor: result.Ctor, }));
      }
    });

    // open
    this._ws.on(WS_EVENT.OPEN, () => {
      this._eb.fire(new ServerEventSocketClientOpen({ client: this }));
    });

    // ping
    this._ws.on(WS_EVENT.PING, () => {
      this._eb.fire(new ServerEventSocketClientPing({ client: this }));
    });

    // pong
    this._ws.on(WS_EVENT.PONG, () => {
      this._eb.fire(new ServerEventSocketClientPong({ client: this }));
    });

    // upgrade
    this._ws.on(WS_EVENT.UGPRADE, () => {
      this._eb.fire(new ServerEventSocketClientUpgrade({ client: this }));
    });

    // unexpected response
    this._ws.on(WS_EVENT.UNEXPECTED_RESPONSE, () => {
      this._eb.fire(new ServerEventSocketClientUnexpectedResponse({ client: this }));
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
    this._log.info(`Sending Message ${msg.constructor.name} to ${this.uuid}`);
    this._ws.send(strMsg);
  }
}
