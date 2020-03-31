import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ChatRepository } from './chat.repository';
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SessionRepository } from "../session/session.repository";
import { CreateChatDto } from "../../../shared/domains/chat/dto/create-chat.dto";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UpdateChatDto } from "../../../shared/domains/chat/dto/update-chat.dto";


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
   * @param trace
   */
  async create(dto: CreateChatDto, authorId: string | null, trace: Trace): Promise<ChatModel> {
    const unsaved: UnsavedModel<ChatModel> = {
      author_id: authorId,
      content: dto.content,
      sent_at: dto.sent_at,
    };
    const user = await this._chatRepo.create(unsaved, undefined, trace);
    return user;
  }


  /**
   * @description
   * Update a model
   *
   * @param model
   * @param updates
   * @param trace
   */
  async update(model: ChatModel, dto: UpdateChatDto, trace: Trace): Promise<ChatModel> {
    if (dto.content) model.content = dto.content;
    const updated = await this._chatRepo.upsert(model, trace);
    return updated;
  }


  /**
   * @description
   * Delete a model
   *
   * @param model 
   * @param trace
   */
  async delete(model: ChatModel, trace: Trace): Promise<ChatModel> {
    const deleted = await this._chatRepo.delete(model, trace);
    if (!deleted) throw new Error(`Unable to delete ${model.id}`);
    return deleted;
  }
}
