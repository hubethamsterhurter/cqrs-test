import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { UserRepository } from "../user/user.repository";
import { AuthTokenRepository } from "./auth-token.repository";
import { AuthTokenModel } from "../../../shared/domains/auth-token/auth-token.model";
import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class AuthTokenService {
  private readonly _log = new ClassLogger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
    @Inject(() => AuthTokenRepository) private readonly _authTokenRepo: AuthTokenRepository,
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
    opts: {
      expires_at: Date | null,
      user: UserModel,
      session: SessionModel,
    },
    trace: Trace,
  ): Promise<AuthTokenModel> {
    const unsaved: UnsavedModel<AuthTokenModel> = {
      user_id: opts.user.id,
      origin_session_id: opts.session.id,
      expires_at: opts.expires_at,
    };
    const authToken = await this._authTokenRepo.create(unsaved, undefined, trace,);
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
    model: AuthTokenModel,
    opts: { expires_at: Date | null, },
    trace: Trace,
  ): Promise<AuthTokenModel> {
    model.expires_at = opts.expires_at;
    const updated = await this._authTokenRepo.upsert(model, trace);
    return updated;
  }


  /**
   * @description
   * Delete a model
   *
   * @param model 
   * @param tracking
   */
  async delete(model: AuthTokenModel, tracking: Trace): Promise<AuthTokenModel> {
    const deleted = await this._authTokenRepo.delete(model, tracking);
    if (!deleted) throw new Error(`Unable to delete ${model.id}`);
    return deleted;
  }
}
