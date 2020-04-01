import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ChatRepository } from './chat.repository';
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SessionRepository } from "../session/session.repository";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { fillUpdate } from "../../../shared/helpers/fill.update.helper";
import { CHAT_FILLABLE_FIELDS } from "../../../shared/domains/chat/chat.definition";
import { AnElemOf } from "../../../shared/types/an-elem-of.type";
import { fillCreate } from "../../../shared/helpers/fill.create.helper";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ChatCrudService {
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
   * @param arg
   */
  async create(arg: {
    raw: Pick<ChatModel, AnElemOf<CHAT_FILLABLE_FIELDS>>,
    sent_at: Date,
    author_id: string | null,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<ChatModel> {
    const filled = fillCreate({
      keys: CHAT_FILLABLE_FIELDS,
      using: arg.raw,
    });

    const unsaved: UnsavedModel<ChatModel> = {
      ...filled,
      author_id: arg.author_id,
      sent_at: arg.sent_at,
    };

    const chat = await this._chatRepo.create({
      inModel: unsaved,
      forceId: undefined,
      requester: arg.requester,
      trace: arg.trace,
    });
    return chat;
  }


  /**
   * @description
   * Update a model
   *
   * @param arg
   */
  async update(arg: {
    model: ChatModel,
    raw: Pick<ChatModel, AnElemOf<CHAT_FILLABLE_FIELDS>>,
    requester: UserModel | null,
    trace: Trace
  }): Promise<ChatModel> {
    fillUpdate({
      mutate: arg.model,
      keys: CHAT_FILLABLE_FIELDS,
      using: arg.raw,
    });

    const updated = await this._chatRepo.upsert({
      inModel: arg.model,
      requester: arg.requester,
      trace: arg.trace,
    });

    return updated;
  }


  /**
   * @description
   * Delete a model
   *
   * @param arg
   */
  async delete(arg: {
    model: ChatModel,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<ChatModel> {
    const deleted = await this._chatRepo.delete({
      inModel: arg.model,
      requester: arg.requester,
      trace: arg.trace,
    });
    if (!deleted) throw new Error(`Unable to delete ${arg.model.id}`);
    return deleted;
  }
}
