import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { UserRepository } from "../user/user.repository";
import { ReauthSessionTokenRepository } from "./reauth-session-token.repository";
import { ReauthSessionTokenModel } from "../../../shared/domains/auth-token/reauth-session-token.model";
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
   * @param opts
   * @param trace
   */
  async create(
    opts: { expires_at: Date | null, user: UserModel, session: SessionModel, },
    trace: Trace,
  ): Promise<ReauthSessionTokenModel> {
    const unsaved: UnsavedModel<ReauthSessionTokenModel> = {
      user_id: opts.user.id,
      session_id: opts.session.id,
      expires_at: opts.expires_at,
    };
    const authToken = await this._reauthTokenRepo.create(unsaved, undefined, trace,);
    return authToken;
  }


  /**
   * @description
   * Update a model
   *
   * @param model
   * @param opts
   * @param trace
   */
  async update(
    model: ReauthSessionTokenModel,
    opts: { expires_at: Date | null, },
    trace: Trace,
  ): Promise<ReauthSessionTokenModel> {
    model.expires_at = opts.expires_at;
    const updated = await this._reauthTokenRepo.upsert(model, trace);
    return updated;
  }


  /**
   * @description
   * Delete a model
   *
   * @param model 
   * @param tracking
   */
  async delete(model: ReauthSessionTokenModel, tracking: Trace): Promise<ReauthSessionTokenModel> {
    const deleted = await this._reauthTokenRepo.delete(model, tracking);
    if (!deleted) throw new Error(`Unable to delete ${model.id}`);
    return deleted;
  }
}
