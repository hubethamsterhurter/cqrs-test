import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { AuthTokenRepository } from "./auth-token.repository";
import { AuthTokenModel } from "../../../shared/domains/auth-token/auth-token.model";
import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class AuthTokenCrudService {
  readonly #log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
    @Inject(() => AuthTokenRepository) private readonly _authTokenRepo: AuthTokenRepository,
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
    fill: {
      expires_at: Date | null,
      user: UserModel,
      session: SessionModel,
    },
    trace: Trace,
  }): Promise<AuthTokenModel> {
    const unsaved: UnsavedModel<AuthTokenModel> = {
      user_id: arg.fill.user.id,
      session_id: arg.fill.session.id,
      expires_at: arg.fill.expires_at,
    };
    const authToken = await this._authTokenRepo.create({
      inModel: unsaved,
      forceId: undefined,
      requester: arg.fill.user,
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
    id: string,
    fill: { expires_at: Date | null, },
    requester: UserModel,
    trace: Trace,
  }): Promise<AuthTokenModel> {
    const updated = await this._authTokenRepo.update({
      id: arg.id,
      fill: arg.fill,
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
    id: string,
    requester: UserModel,
    trace: Trace,
  }): Promise<AuthTokenModel | null> {
    const deleted = await this._authTokenRepo.delete({
      id: arg.id,
      requester: arg.requester,
      trace: arg.trace,
    });
    if (!deleted) this.#log.info(`Unable to delete ${AuthTokenModel.name}.${arg.id}: not found`);
    return deleted;
  }
}
