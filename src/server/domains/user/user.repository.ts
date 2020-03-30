import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { UserModel } from "../../../shared/domains/user/user.model";
import { BaseRepository } from "../../utils/repository/base-repository";
import { addToManyIndex } from "../../utils/repository/modules/add-to-many-index.helper";
import { updateManyIndex } from "../../utils/repository/modules/update-many-index.helper";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { addToUniqueIndex } from "../../utils/repository/modules/add-to-unique-index.helper";
import { updateUniqueIndex } from "../../utils/repository/modules/update-unique-index.helper";

let __created__ = false;
@Service({ global: true })
export class UserRepository extends BaseRepository<UserModel> {
  private _index_user_name: Map<UserModel['user_name'], UserModel> = new Map();
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

  /** @inheritdoc */
  protected _onCreateHook(created: Readonly<UserModel>) {
    addToUniqueIndex(this._index_user_name, created, 'user_name');
    addToManyIndex(this._index_colour, created, 'colour');
  }

  /** @inheritdoc */
  protected _onUpdateHook(models: { old: Readonly<UserModel>, new: Readonly<UserModel> }) {
    updateUniqueIndex(this._index_user_name, models, 'user_name');
    updateManyIndex(this._index_colour, models, 'colour');
  }

  /** @inheritdoc */
  protected _onDeleteHook(models: { old: Readonly<UserModel>, new: Readonly<UserModel> }) {
    updateUniqueIndex(this._index_user_name, models, 'user_name');
    updateManyIndex(this._index_colour, models, 'colour');
  }

  /** @inheritdoc */
  async create(
    rawModel: UnsavedModel<UserModel>,
    forceId: string | undefined = undefined,
    trace: Trace,
  ): Promise<UserModel> {
    if (this._index_user_name.has(rawModel.user_name)) {
      throw new TypeError('user_name must be unique');
    }
    return super.create(rawModel, forceId, trace);
  }

  /** @inheritdoc */
  async upsert(
    freshModel: UserModel,
    trace: Trace,
  ): Promise<UserModel> {
    const old = this._find(freshModel.id);
    if (old && (old.user_name !== freshModel.user_name)) {
      if (this._index_user_name.has(freshModel.user_name)) { throw new TypeError('user_name must be unique'); }
    }
    return super.upsert(freshModel, trace);
  }

  /**
   * @description
   * Find a user by user_name
   * 
   * @param user_name 
   */
  async findByUserName(user_name: string): Promise<UserModel | null> {
    const user = await this._index_user_name.get(user_name);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_name
   * 
   * @param user_name 
   */
  async findOrFailByUserName(user_name: string): Promise<UserModel> {
    const user = await this._index_user_name.get(user_name);
    if (!user) throw new ReferenceError(`Failed to find ${UserModel.name} with user_name "${user_name}"`);
    return user;
  }
}
