import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { HandleCm } from '../../decorators/handle-client-message.decorator';
import { SocketClientMessageParsedSeo } from '../../events/models/socket-client.message-parsed.seo';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { ServerEventConsumer } from "../../decorators/server-event-consumer.decorator";
import { CreateChatCmo } from "../../../shared/message-client/models/create-chat.cmo";
import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";
import { SessionRepository } from "../session/session.repository";


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
  @HandleCm(CreateChatCmo)
  async handleClientCreateChat(evt: SocketClientMessageParsedSeo<CreateChatCmo>) {
    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._chatService.create(
      evt._p.message.cdto,
      session.user_id,
      evt.trace
    );
  }
}