import { Service, Inject } from "typedi";
import { UserRepository } from "./user.repository";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { USER_FILLABLE_FIELDS } from "../../../shared/domains/user/user.definition";
import { AnElemOf } from "../../../shared/types/an-elem-of.type";
import { fillAll } from "../../../shared/helpers/fill-all.helper";
import { fillPartial } from "../../../shared/helpers/fill-partial.helper";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class UserCrudService {
  readonly #log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
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
    fill: Pick<UserModel, AnElemOf<USER_FILLABLE_FIELDS>>,
    user_name: string,
    password: string,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<UserModel> {
    const filled = fillAll({
      keys: USER_FILLABLE_FIELDS,
      data: arg.fill,
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
    id: string,
    fill: Partial<Pick<UserModel, AnElemOf<USER_FILLABLE_FIELDS>>>,
    user_name?: string,
    password?: string,
    requester: UserModel | null,
    trace: Trace
  }): Promise<UserModel> {
    const filled: Partial<UnsavedModel<UserModel>> = fillPartial({
      keys: USER_FILLABLE_FIELDS,
      data: arg.fill,
    });

    if (arg.user_name) filled.user_name = arg.user_name;
    if (arg.password) filled.password = arg.password;

    const updated = await this._userRepo.update({
      id: arg.id,
      fill: filled,
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
    requester: UserModel | null,
    trace: Trace,
  }): Promise<UserModel | null> {
    const deleted = await this._userRepo.delete({
      id: arg.id,
      requester: arg.requester,
      trace: arg.trace,
    });
    if (!deleted) this.#log.warn(`Unable to delete ${UserModel.name}.${arg.id}: not found`);
    return deleted;
  }
}
