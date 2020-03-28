import ws from 'ws';
import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEventStream } from "../event-stream/server-event-stream";
import { Factory } from '../../../shared/types/factory.type';
import { SocketClient } from './socket-client';
import { ClientMessageParser } from '../../../shared/message-client/modules/client-message-parser';
import { SessionModel } from '../../../shared/domains/session/session.model';

interface Payload { rawWebSocket: ws, id: string, client_id: SessionModel['id'] };

let __created__ = false;
@Service({ global: true })
export class SocketClientFactory implements Factory<SocketClient, Payload> {
  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _clientMessageParser
   */
  constructor(
    @Inject(() => ServerEventBus) private _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private _es: ServerEventStream,
    @Inject(() => ClientMessageParser) private _clientMessageParser: ClientMessageParser,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @inheritdoc
   */
  create(using: Payload): SocketClient {
    const client = new SocketClient(
      using.id,
      using.client_id,
      using.rawWebSocket,
      this._eb,
      this._es,
      this._clientMessageParser,
    );

    return client;
  }
}