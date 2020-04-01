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
    Array.from(this.table).forEach(([, model]) => this._onCreateHook(model));
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
  async create(arg: {
    inModel: UnsavedModel<UserModel>,
    forceId: string | undefined,
    requester: UserModel | null
    trace: Trace,
  }): Promise<UserModel> {
    if (this._index_user_name.has(arg.inModel.user_name)) {
      throw new TypeError('user_name must be unique');
    }
    return await super.create({
      inModel: arg.inModel,
      forceId: arg.forceId,
      requester: arg.requester,
      trace: arg.trace,
    });
  }

  /** @inheritdoc */
  async upsert(arg: {
    inModel: UserModel,
    requester: UserModel|  null,
    trace: Trace,
  }): Promise<UserModel> {
    const old = this._find(arg.inModel.id);
    if (old && (old.user_name !== arg.inModel.user_name)) {
      if (this._index_user_name.has(arg.inModel.user_name)) { throw new TypeError('user_name must be unique'); }
    }
    return super.upsert({
      inModel: arg.inModel,
      requester: arg.requester,
      trace: arg.trace,
    });
  }

  /**
   * @description
   * Find a user by user_name
   * 
   * @param arg 
   */
  async findByUserName(arg: { user_name: string }): Promise<UserModel | null> {
    const user = await this._index_user_name.get(arg.user_name);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_name
   * 
   * @param arg 
   */
  async findOrFailByUserName(arg: { user_name: string }): Promise<UserModel> {
    const user = await this._index_user_name.get(arg.user_name);
    if (!user) throw new ReferenceError(`Failed to find ${UserModel.name} with user_name "${arg.user_name}"`);
    return user;
  }
}
