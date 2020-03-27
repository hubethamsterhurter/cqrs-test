import * as op from 'rxjs/operators';
import { Service, Inject } from 'typedi';
import { ServerEventBus } from '../event-bus/server-event-bus';
import { ServerEventStream } from '../event-stream/server-event-stream';
import { SocketClient } from '../socket-client/socket-client';
import { ServerEventSocketServerConnection } from '../../events/models/server-event.socket-server.connection';
import { ServerMessage } from '../../../shared/message-server/modules/server-message-registry';
import { ServerMessageSocketConnection } from '../../../shared/message-server/models/server-message.socket-connection';
import { ServerEventModelCreated } from '../../events/models/server-event.model-created';
import { UserModel } from '../../../shared/domains/user/user.model';
import { ChatModel } from '../../../shared/domains/chat/chat.model';
import { ServerMessageUserCreated } from '../../../shared/message-server/models/server-message.user.created';
import { createdEventOf, updatedEventOf } from '../../helpers/server-model-event-filter.helper';
import { ServerMessageChatCreated } from '../../../shared/message-server/models/server-message.chat.created';
import { ServerEventModelUpdated } from '../../events/models/server-event.model-updated';
import { ServerMessageUserUpdated } from '../../../shared/message-server/models/server-message.user.updated';
import { ServerMessageInit } from '../../../shared/message-server/models/server-message.init';
import { UserRepository } from '../../domains/user/user.repository';
import { ChatRepository } from '../../domains/chat/chat.repository';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { ServerEventSocketClientClose } from '../../events/models/server-event.socket-client.close';

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SocketWarehouse {
  private _log = new ClassLogger(this);
  private _wscs: SocketClient[] = [];

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
    @Inject(() => UserRepository) private readonly _userRepository: UserRepository,
    @Inject(() => ChatRepository) private readonly _chatRepository: ChatRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    this
      ._es
      .of(ServerEventSocketServerConnection)
      .subscribe(async (connectionEvt) => {
        this._log.info('socket connected......');

        const { uuid, connected_at } = connectionEvt._p.wsc;
        this._wscs.push(connectionEvt._p.wsc);

        const [
          chats,
          users,
        ] = await Promise.all([
          this._chatRepository.findAll(),
          this._userRepository.findAll(),
        ]);

        connectionEvt._p.wsc.send(new ServerMessageInit({
          chats,
          users,
        }));

        this.broadcastAll(new ServerMessageSocketConnection({
          uuid,
          connected_at
        }));
      });

    // broadcast model created events
    this
      ._es
      .of(ServerEventModelCreated)
      .subscribe((evt) => {
        this._log.info('Broadcasting ServerEventModelCreated...', evt._p.CTor.name);
        if (createdEventOf(UserModel)(evt)) {
          this.broadcastAll(new ServerMessageUserCreated({ model: evt._p.model }));
        } else if (createdEventOf(ChatModel)(evt)) {
          this.broadcastAll(new ServerMessageChatCreated({ model: evt._p.model }));
        }
      });

    // broadcast model updated events
    this
      ._es
      .of(ServerEventModelUpdated)
      .subscribe((evt) => {
        this._log.info('Broadcasting ServerEventModelUpdated...', evt._p.CTor.name);
        if (updatedEventOf(UserModel)(evt)) {
          this.broadcastAll(new ServerMessageUserUpdated({ model: evt._p.model }));
        }
      });

    // removed closed sockets
    this
      ._es
      .of(ServerEventSocketClientClose)
      .subscribe((evt) => {
        this._log.info(`Removing closed socket ${evt._p.client.uuid} (code: "${evt._p.code}", reason: "${evt._p.reason}")`);
        this._wscs = this._wscs.filter(ws => ws.uuid !== evt._p.client.uuid);
      });
  }


  /**
   * @description
   * Broadcast a message to all clients
   *
   * @param msg
   */
  broadcastAll(msg: ServerMessage) {
    this._wscs.forEach(wsc => wsc.send(msg));
  }


  /**
   * @description
   * Broadcast a message to other sockets
   *
   * @param msg
   * @param except
   */
  broadcastOthers(msg: ServerMessage, except: SocketClient) {
    this._wscs.forEach(wsc => { if (wsc.uuid !== except.uuid) wsc.send(msg); })
  }
}