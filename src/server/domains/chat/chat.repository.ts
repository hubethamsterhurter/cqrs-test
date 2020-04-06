import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { BaseRepository } from "../../utils/repository/base-repository";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { Db } from "../../utils/db/db";

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
    @Inject(() => IdFactory) _idFactory: IdFactory,
    @Inject(() => ServerEventBus) _eb: ServerEventBus,
    @Inject(() => Db) _db: Db,
  ) {
    super(_db, _idFactory, ChatModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}