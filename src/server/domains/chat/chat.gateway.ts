import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SubscribeMessage } from '../../decorators/subscribe-message.decorator';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { ChatCrudService } from "./chat.crud.service";
import { SessionRepository } from "../session/session.repository";
import { CreateChatCmo } from "../../../shared/domains/chat/cmo/create-chat.cmo";
import { UserRepository } from "../user/user.repository";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
export class ChatGateway {
  readonly #log = new Logger(this);


  /**
   * @constructor
   * 
   * @param _chatService
   * @param _sessionRepo
   * @param _sessionRepo
   */
  constructor(
    @Inject(() => ChatCrudService) private readonly _chatService: ChatCrudService,
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
  @SubscribeMessage(CreateChatCmo)
  async create(evt: SCMessageSeo<CreateChatCmo>) {
    const session = evt.dto.socket.session;
    const user = evt.dto.socket.user;
    await this._chatService.create({
      fill: {
        content: evt.dto.message.dto.content,
      },
      sent_at: evt.dto.message.dto.sent_at,
      author_id: user ? user.id : null,
      requester: user,
      trace: evt.trace,
    });
  }
}