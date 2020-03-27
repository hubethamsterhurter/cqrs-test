import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ChatRepository } from './chat.repository';
import * as op from "rxjs/operators";
import { ServerEventSocketClientMessageParsed } from "../../events/models/server-event.socket-client.message-parsed";
import { ClientMessageCreateChat } from "../../../shared/message-client/models/client-message.create-chat";
import { ofClientMessage } from "../../helpers/server-client-message-event-filter.helper";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ChatService {
  private readonly _log = new ClassLogger(ChatService)

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _repository
   */
  constructor(
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) readonly _es: ServerEventStream,
    @Inject(() => ChatRepository) readonly _repository: ChatRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // create chat
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageCreateChat)))
      .subscribe(evt => {
        const now = new Date();
        // TOOD: get id from socket
        // const authorId = evt._p.client.connected_at;
        const authorId = null;
        const chat = new ChatModel({
          author_id: authorId,
          content: evt._p.message.content,
          sent_at: evt._p.message.sent_at,
          updated_at: now,
          created_at: now,
          deleted_at: null,
        });
        this._repository.create(chat);
      });
  }
}
