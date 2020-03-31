import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ChatRepository } from './chat.repository';
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SessionRepository } from "../session/session.repository";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UpdateChatCmDto } from "../../../shared/domains/chat/cmo/update-chat.cmo";
import { UserModel } from "../../../shared/domains/user/user.model";
import { fill } from "../../../shared/helpers/fill-fillable.helper";
import { CHAT_FILLABLE_FIELDS } from "../../../shared/domains/chat/chat.definition";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ChatService {
  private readonly _log = new Logger(this)


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
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Create a model
   * 
   * @param dto 
   * @param auhtorId
   * @param requester
   * @param trace
   */
  async create(opts: {
    raw: {
      content: ChatModel['content'],
      sent_at: ChatModel['sent_at'],
    },
    authorId: string | null,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<ChatModel> {
    const unsaved: UnsavedModel<ChatModel> = {
      author_id: opts.authorId,
      content: opts.raw.content,
      sent_at: opts.raw.sent_at,
    };
    const chat = await this._chatRepo.create(unsaved, undefined, opts.requester, opts.trace);
    return chat;
  }


  /**
   * @description
   * Update a model
   *
   * @param model
   * @param updates
   * @param requester
   * @param trace
   */
  async update(opts: {
    model: ChatModel,
    dto: UpdateChatCmDto,
    requester: UserModel | null,
    trace: Trace
  }): Promise<ChatModel> {
    fill(opts.model, CHAT_FILLABLE_FIELDS, opts.dto);
    const updated = await this._chatRepo.upsert(opts.model, opts.requester, opts.trace);
    return updated;
  }


  /**
   * @description
   * Delete a model
   *
   * @param model 
   * @param requester
   * @param trace
   */
  async delete(opts: {
    model: ChatModel,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<ChatModel> {
    const deleted = await this._chatRepo.delete(opts.model, opts.requester, opts.trace);
    if (!deleted) throw new Error(`Unable to delete ${opts.model.id}`);
    return deleted;
  }
}
