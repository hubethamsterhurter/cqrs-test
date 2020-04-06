import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserModel } from "../../../shared/domains/user/user.model";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { SESSION_FILLABLE_FIELDS } from "../../../shared/domains/session/session.definition";
import { AnElemOf } from "../../../shared/types/an-elem-of.type";
import { fillAll } from "../../../shared/helpers/fill-all.helper";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { fillPartial } from "../../../shared/helpers/fill-partial.helper";


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@SeConsumer()
export class SessionCrudService {
  readonly #log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _sessionRepo
   * @param _wscFactory
   * @param _idFactory
   * @param _socketWarehouse
   */
  constructor(
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
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
    fill: Pick<SessionModel, AnElemOf<SESSION_FILLABLE_FIELDS>>,
    socket_id: string;
    user_id: string | null;
    connected_at: Date,
    disconnected_at: Date | null,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<SessionModel> {
    const filled = fillAll({
      keys: SESSION_FILLABLE_FIELDS,
      data: arg.fill,
    });

    const unsaved: UnsavedModel<SessionModel> = {
      ...filled,
      user_id: arg.user_id,
      connected_at: arg.connected_at,
      disconnected_at: arg.disconnected_at,
      socket_id: arg.socket_id,
    };

    const session = await this._sessionRepo.create({
      inModel: unsaved,
      forceId: undefined,
      requester: arg.requester,
      trace: arg.trace,
    });

    return session;
  }



  /**
   * @description
   * Update a model
   *
   * @param arg
   */
  async update(arg: {
    id: string,
    fill: Partial<Pick<SessionModel, AnElemOf<SESSION_FILLABLE_FIELDS>>>,
    requester: UserModel | null,
    user: UserModel | null | undefined,
    disconnected_at: Date | null | undefined,
    trace: Trace
  }): Promise<SessionModel> {
    const filled: Partial<UnsavedModel<SessionModel>> = fillPartial({
      keys: SESSION_FILLABLE_FIELDS,
      data: arg.fill,
    });

    if (arg.disconnected_at !== undefined) filled.disconnected_at = arg.disconnected_at;
    if (arg.user !== undefined) filled.user_id = arg.user?.id ?? null;

    const updated = await this._sessionRepo.update({
      id: arg.id,
      fill: filled,
      requester: arg.requester,
      trace: arg.trace,
    });

    return updated;
  }



  /**
   * @description
   * Delete a session
   *
   * @param arg
   */
  async delete(arg: {
    id: string,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<SessionModel | null> {
    return await this._sessionRepo.delete({
      id: arg.id,
      requester: arg.requester,
      trace: arg.trace,
    });
  }
}
