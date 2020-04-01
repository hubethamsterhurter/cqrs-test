import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserRepository } from "./user.repository";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UserSignedUpSeo, UserSignedUpSeDto } from "../../events/models/user.signed-up.seo";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { randomElement } from "../../../shared/helpers/random-element";
import { USER_COLOURS } from "../../../shared/constants/user-colour";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { CreateUserCmDto } from "../../../shared/domains/user/cmo/create-user.cmo";
import { UpdateUserCmDto } from "../../../shared/domains/user/cmo/update-user.cmo";
import { USER_FILLABLE_FIELDS } from "../../../shared/domains/user/user.definition";
import { IModel } from "../../../shared/interfaces/interface.model";
import { BaseModel } from "../../../shared/base/base.model";
import { fillUpdate } from "../../../shared/helpers/fill.update.helper";
import { AnElemOf } from "../../../shared/types/an-elem-of.type";
import { fillCreate } from "../../../shared/helpers/fill.create.helper";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class UserService {
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
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Sign up
   * 
   * @param arg
   */
  async signUp(arg: {
    session: SessionModel,
    dto: CreateUserCmDto,
    trace: Trace
  }): Promise<void> {
    const user = await this.create(arg.dto, arg.trace);
    this._eb.fire(new UserSignedUpSeo({
      dto: new UserSignedUpSeDto({
        session: arg.session,
        user,
      }),
      trace: arg.trace.clone(),
    }));
  }



  /**
   * @description
   * Log in
   *
   * @param arg
   */
  passwordMatch(arg: {
    user: UserModel,
    password: string,
  }): boolean {
    if (arg.user.password !== arg.password) return false;
    return true;
  }



  /**
   * @description
   * Create a model
   * 
   * @param arg
   */
  async create(arg: {
    raw: Pick<UserModel, AnElemOf<USER_FILLABLE_FIELDS>>,
    user_name: string,
    password: string,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<UserModel> {
    const filled = fillCreate({
      keys: USER_FILLABLE_FIELDS,
      using: arg.raw,
    });

    const unsaved: UnsavedModel<UserModel> = {
      ...filled,
      user_name: arg.user_name,
      password: arg.password,
    };

    const user = await this._userRepo.create({
      inModel: unsaved,
      forceId: undefined,
      requester: arg.requester,
      trace: arg.trace,
    });

    return user;
  }


  /**
   * @description
   * Update a model
   *
   * @param arg
   */
  async update(arg: {
    model: UserModel,
    raw: Pick<UserModel, AnElemOf<USER_FILLABLE_FIELDS>>,
    user_name?: string,
    password?: string,
    requester: UserModel | null,
    trace: Trace
  }): Promise<UserModel> {
    fillUpdate({
      mutate: arg.model,
      keys: USER_FILLABLE_FIELDS,
      using: arg.raw,
    });
    if (arg.user_name) arg.model.user_name = arg.user_name;
    if (arg.password) arg.model.password = arg.password;

    const updated = await this._userRepo.upsert({
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
   * @param model 
   * @param tracking
   */
  async delete(model: UserModel, tracking: Trace): Promise<UserModel> {
    const deleted = await this._userRepo.delete(model, tracking);
    if (!deleted) throw new Error(`Unable to delete ${model.id}`);
    return deleted;
  }
}
