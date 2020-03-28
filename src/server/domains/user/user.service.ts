import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserRepository } from "./user.repository";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ServerEventUserSignedUp } from "../../events/models/server-event.user.signed-up";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { randomElement } from "../../../shared/helpers/random-element";
import { USER_COLOURS, A_USER_COLOUR } from "../../../shared/constants/user-colour";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { Trace } from "../../../shared/helpers/Tracking.helper";


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
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Sign up
   * 
   * @param session
   * @param raw 
   * @param tracking
   */
  async signUp(
    session: SessionModel,
    raw: {
      user_name: string,
      password: string,
      colour?: A_USER_COLOUR,
    },
    tracking: Trace,
  ): Promise<void> {
    const user = await this.create(
      raw,
      tracking,
    );
    this._eb.fire(new ServerEventUserSignedUp({
      _p: {
        session,
        user,
      },
      _o: tracking.clone(),
    }));
  }



  /**
   * @description
   * Log in
   * 
   * @param data 
   */
  passwordMatch(user: UserModel, password: string): boolean {
    if (user.password !== password) return false;
    return true;
  }



  /**
   * @description
   * Create a user
   * 
   * @param raw 
   * @param trace
   */
  async create(
    raw: {
      user_name: string,
      password: string,
      colour?: A_USER_COLOUR
    },
    trace: Trace,
  ): Promise<UserModel> {
    const rawUser: UnsavedModel<UserModel> = {
      user_name: raw.user_name,
      password: raw.password,
      colour: raw.colour ?? randomElement(USER_COLOURS),
    };
    const user = await this._userRepo.create(
      rawUser,
      undefined,
      trace,
    );
    return user;
  }



  /**
   * @description
   * Update a user
   *
   * @param user
   * @param updates
   * @param tracking
   */
  async update(
    user: UserModel,
    updates: {
      user_name?: string,
      password?: string,
      colour?: A_USER_COLOUR
    },
    tracking: Trace,
  ): Promise<UserModel> {
    if (updates.user_name) user.user_name = updates.user_name;
    if (updates.password) user.password = updates.password;
    if (updates.colour) user.colour = updates.colour;
    const updated = await this._userRepo.upsert(user, tracking);
    return updated;
  }


  /**
   * @description
   * Delete a user
   *
   * @param user 
   * @param tracking
   */
  async delete(
    user: UserModel,
    tracking: Trace,
  ): Promise<UserModel> {
    const deleted = await this._userRepo.delete(user, tracking);
    if (!deleted) throw new Error(`Unable to delete ${user.id}`);
    return deleted;
  }
}
