import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { UserRepository } from "../user/user.repository";
import { AuthTokenRepository } from "./auth-token.repository";
import { CreateAuthTokenDto } from "../../../shared/domains/auth-token/dto/create-auth-token.dto";
import { AuthTokenModel } from "../../../shared/domains/auth-token/auth-token.model";


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
   * @param dto 
   * @param opts
   * @param trace
   */
  async create(
    dto: CreateAuthTokenDto,
    opts: { expires_at: Date | null, user_id: string },
    trace: Trace,
  ): Promise<AuthTokenModel> {
    const unsaved: UnsavedModel<AuthTokenModel> = {
      body: dto.body,
      user_id: opts.user_id,
      expires_at: opts.expires_at,
    };
    const user = await this._authTokenRepo.create(unsaved, undefined, trace,);
    return user;
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
