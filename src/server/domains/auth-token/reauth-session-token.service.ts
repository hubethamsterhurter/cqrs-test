import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { UserRepository } from "../user/user.repository";
import { ReauthSessionTokenRepository } from "./reauth-session-token.repository";
import { ReauthSessionTokenModel } from "../../../shared/domains/reauth-session-token/reauth-session-token.model";
import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ReauthSessionTokenService {
  private readonly _log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
    @Inject(() => ReauthSessionTokenRepository) private readonly _reauthTokenRepo: ReauthSessionTokenRepository,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
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
    unsaved: {
      expires_at: Date | null,
      user: UserModel,
      session: SessionModel,
    },
    trace: Trace,
  }): Promise<ReauthSessionTokenModel> {
    const unsaved: UnsavedModel<ReauthSessionTokenModel> = {
      user_id: arg.unsaved.user.id,
      session_id: arg.unsaved.session.id,
      expires_at: arg.unsaved.expires_at,
    };
    const authToken = await this._reauthTokenRepo.create({
      inModel: unsaved,
      forceId: undefined,
      requester: arg.unsaved.user,
      trace: arg.trace,
    });
    return authToken;
  }


  /**
   * @description
   * Update a model
   *
   * @param arg
   */
  async update(arg: {
    model: ReauthSessionTokenModel,
    requester: UserModel,
    changes: { expires_at: Date | null, },
    trace: Trace,
  }): Promise<ReauthSessionTokenModel> {
    arg.model.expires_at = arg.changes.expires_at;
    const updated = await this._reauthTokenRepo.upsert({
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
    model: ReauthSessionTokenModel,
    requester: UserModel,
    trace: Trace,
  }): Promise<ReauthSessionTokenModel> {
    const deleted = await this._reauthTokenRepo.delete({
      inModel: arg.model,
      requester: arg.requester,
      trace: arg.trace,
    });
    if (!deleted) throw new Error(`Unable to delete ${arg.model.id}`);
    return deleted;
  }
}
