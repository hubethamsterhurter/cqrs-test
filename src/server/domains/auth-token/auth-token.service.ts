import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UserSignedUpSeo } from "../../events/models/user.signed-up.seo";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { randomElement } from "../../../shared/helpers/random-element";
import { USER_COLOURS } from "../../../shared/constants/user-colour";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { CreateUserDto } from "../../../shared/domains/user/dto/create-user.dto";
import { UpdateUserDto } from "../../../shared/domains/user/dto/update-user.dto";
import { UserRepository } from "../user/user.repository";
import { AuthTokenRepository } from "./auth-token.repository";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class UserService {
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
   * @param trace
   */
  async create(dto: CreateUserDto, trace: Trace): Promise<UserModel> {
    const unsaved: UnsavedModel<UserModel> = {
      user_name: dto.user_name,
      password: dto.password,
      colour: dto.colour ?? randomElement(USER_COLOURS),
    };
    const user = await this._userRepo.create(unsaved, undefined, trace,);
    return user;
  }


  /**
   * @description
   * Update a model
   *
   * @param model
   * @param dto
   * @param trace
   */
  async update(model: UserModel, dto: UpdateUserDto, trace: Trace): Promise<UserModel> {
    if (dto.user_name) model.user_name = dto.user_name;
    if (dto.password) model.password = dto.password;
    if (dto.colour) model.colour = dto.colour;
    const updated = await this._userRepo.upsert(model, trace);
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