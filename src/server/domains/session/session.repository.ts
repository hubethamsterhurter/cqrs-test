import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { BaseRepository } from "../../utils/repository/base-repository";
import { SessionModel } from "../../../shared/domains/session/session.model";

let __created__ = false;
@Service({ global: true })
export class SessionRepository extends BaseRepository<SessionModel> {
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
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
  ) {
    super(_idFactory, SessionModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}