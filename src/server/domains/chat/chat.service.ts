import * as op from "rxjs/operators";
import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ChatRepository } from './chat.repository';
import { ServerEventSocketClientMessageParsed } from "../../events/models/server-event.socket-client.message-parsed";
import { ClientMessageCreateChat } from "../../../shared/message-client/models/client-message.create-chat";
import { ofClientMessage } from "../../helpers/server-client-message-event-filter.helper";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { SessionRepository } from "../client/session.repository";


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
   * @param _chatRepo
   */
  constructor(
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
    @Inject(() => ChatRepository) private readonly _chatRepo: ChatRepository,
    @Inject(() => SessionRepository) private readonly _clientRepo: SessionRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // create chat
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageCreateChat)))
      .subscribe(async (evt) => {
        const client = await this._clientRepo.findOneOrFail(evt._p.socket.session_id);
        const chat: UnsavedModel<ChatModel> = {
          author_id: client.user_id ?? null,
          content: evt._p.message.content,
          sent_at: evt._p.message.sent_at,
        };
        this._chatRepo.create(chat, undefined, evt._o);
      });
  }
}
