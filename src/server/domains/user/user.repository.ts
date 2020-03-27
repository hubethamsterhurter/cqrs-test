import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { UserModel } from "../../../shared/domains/user/user.model";
import { BaseRepository } from "../base-repository";

let __created__ = false;
@Service({ global: true })
export class UserRepository extends BaseRepository<UserModel> {
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
    super(_idFactory, UserModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}