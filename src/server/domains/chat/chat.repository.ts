import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { BaseRepository } from "../base-repository";
import { ChatModel } from "../../../shared/domains/chat/chat.model";

let __created__ = false;
@Service({ global: true })
export class ChatRepository extends BaseRepository<ChatModel> {
  /**
   * @constructor
   *
   * @param _idFactory
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => IdFactory) readonly _idFactory: IdFactory,
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
  ) {
    super(_idFactory, ChatModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}