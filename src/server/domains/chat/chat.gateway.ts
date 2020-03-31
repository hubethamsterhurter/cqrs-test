import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { HandleCm } from '../../decorators/handle-cm.decorator';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { SEConsumer } from "../../decorators/se-consumer.decorator";
import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";
import { SessionRepository } from "../session/session.repository";
import { CreateChatCmo } from "../../../shared/domains/chat/cmo/create-chat.cmo";
import { UserRepository } from "../user/user.repository";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SEConsumer()
export class ChatGateway {
  private _log = new Logger(this);


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
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
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
  async create(evt: SCMessageSeo<CreateChatCmo>) {
    const session = await this._sessionRepo.findOneOrFail(evt.dto.socket.session_id);
    const user = session.user_id ? await this._userRepo.findOneOrFail(session.user_id) : null;
    await this._chatService.create({
      raw: {
        content: evt.dto.message.dto.content,
        sent_at: evt.dto.message.dto.sent_at,
      },
      authorId: user ? user.id : null,
      requester: user,
      trace: evt.trace,
    });
  }
}