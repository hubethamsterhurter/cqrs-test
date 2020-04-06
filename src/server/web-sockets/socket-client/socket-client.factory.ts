import ws from 'ws';
import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { Factory } from '../../../shared/types/factory.type';
import { SocketClient } from './socket-client';
import { SessionModel } from '../../../shared/domains/session/session.model';
import { MessageParser } from '../../../shared/util/message-parser.util';
import { UserModel } from '../../../shared/domains/user/user.model';

interface Payload {
  rawWebSocket: ws,
  id: string,
  user: UserModel | null,
  session: SessionModel,
};



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
    @Inject(() => MessageParser) private _clientMessageParser: MessageParser,
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
      using.session,
      using.user,
      this._clientMessageParser,
      using.rawWebSocket,
      this._eb,
      this._es,
    );

    return client;
  }
}