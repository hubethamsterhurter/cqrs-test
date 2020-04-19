import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SubscribeMessage } from '../../decorators/subscribe-message.decorator';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { EventStation } from "../../decorators/event-station.decorator";
import { CreateChatCommand } from "../../../shared/domains/chat/command.create-chat";
import { ChatIngress } from "./chat.ingress";
import { SCMessageEvent } from "../../events/event.sc.message";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@EventStation()
export class ChatGateway {
  readonly #log = new Logger(this);


  /**
   * @constructor
   * 
   * @param _chatIngress
   */
  constructor(
    @Inject(() => ChatIngress) private readonly _chatIngress: ChatIngress,
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
  @SubscribeMessage(CreateChatCommand)
  async create(evt: SCMessageEvent<CreateChatCommand>) {
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