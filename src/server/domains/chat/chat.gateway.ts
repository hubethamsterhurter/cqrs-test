import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { HandleClientMessage } from '../../decorators/handle-client-message.decorator';
import { ServerEventSocketClientMessageParsed } from '../../events/models/server-event.socket-client.message-parsed';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { ServerEventConsumer } from "../../decorators/server-event-consumer.decorator";
import { ClientMessageCreateChat } from "../../../shared/message-client/models/client-message.create-chat";
import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";
import { SessionRepository } from "../session/session.repository";
import { CreateChatDto } from "../../../shared/domains/chat/dto/create-chat.dto";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@ServerEventConsumer()
export class ChatGateway {
  private _log = new ClassLogger(this);


  /**
   * @constructor
   * 
   * @param _sessionService
   * @param _userService
   * @param _sessionRepo
   * @param _userRepo
   */
  constructor(
    @Inject(() => ChatRepository) private readonly _chatRepo: ChatRepository,
    @Inject(() => ChatService) private readonly _chatService: ChatService,
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Fired when as client tries to create user
   * 
   * @param evt 
   */
  @HandleClientMessage(ClientMessageCreateChat)
  async handleClientCreateChat(evt: ServerEventSocketClientMessageParsed<ClientMessageCreateChat>) {
    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._chatService.create(
      new CreateChatDto({
        content: evt._p.message.content,
        sent_at: evt._p.message.sent_at,
      }),
      session.user_id,
      evt._o
    );
  }
}