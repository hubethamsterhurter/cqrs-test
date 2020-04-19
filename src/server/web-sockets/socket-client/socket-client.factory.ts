import ws from 'ws';
import { Service, Inject } from "typedi";
import { EventBus } from "../../global/event-bus/event-bus";
import { EventStream } from "../../global/event-stream/event-stream";
import { Factory } from '../../../shared/types/factory.type';
import { SocketClient } from './socket-client';
import { MessageParser } from '../../../shared/util/message-parser.util';
import { UserModel } from '../../domains/user/user.model';
import { SessionModel } from '../../domains/session/session.model';

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
    @Inject(() => EventBus) private _eb: EventBus,
    @Inject(() => EventStream) private _es: EventStream,
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