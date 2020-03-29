import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { UserModel } from "../../../shared/domains/user/user.model";
import { BaseRepository } from "../base-repository";
import { addToIndex } from "../modules/add-to-index.helper";
import { updateIndex } from "../modules/update-index.helper";

let __created__ = false;
@Service({ global: true })
export class UserRepository extends BaseRepository<UserModel> {
  private _index_user_name: Map<UserModel['user_name'], UserModel[]> = new Map();
  private _index_colour: Map<UserModel['colour'], UserModel[]> = new Map();

  /**
   * @constructor
   *
   * @param _idFactory
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => IdFactory) readonly _idFactory: IdFactory,
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
  ) {
    super(_idFactory, UserModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  /**
   * @description
   * Find a user by user_name
   * 
   * @param user_name 
   */
  async findByUserName(user_name: string): Promise<UserModel | null> {
    const users = await this.findAll();
    const targetUser = users.find(user => user.user_name === user_name);
    return targetUser ?? null;
  }

  // async findByUserColour(colour: A_USER_COLOUR): Promise<UserModel[]> {
  //   return this._index_colour.get(colour) ?? [];
  // }

  // async findByUserName(user_name: string): Promise<UserModel[]> {
  //   return this._index_user_name.get(user_name) ?? [];
  // }


  /** * @inheritdoc */
  protected onCreateHook(created: Readonly<UserModel>) {
    addToIndex(this._index_user_name, created, 'user_name');
    addToIndex(this._index_colour, created, 'colour');
  }

  /** * @inheritdoc */
  protected onUpdateHook(models: { old: Readonly<UserModel>, new: Readonly<UserModel> }) {
    updateIndex(this._index_user_name, models, 'user_name');
    updateIndex(this._index_colour, models, 'colour');
  }

  /** * @inheritdoc */
  protected onDeleteHook(models: { old: Readonly<UserModel>, new: Readonly<UserModel> }) {
    updateIndex(this._index_user_name, models, 'user_name');
    updateIndex(this._index_colour, models, 'colour');
  }
}