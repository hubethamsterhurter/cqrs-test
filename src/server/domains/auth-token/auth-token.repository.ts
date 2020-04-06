import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { BaseRepository } from "../../utils/repository/base-repository";
import { addToManyIndex } from "../../utils/repository/modules/add-to-many-index.helper";
import { updateManyIndex } from "../../utils/repository/modules/update-many-index.helper";
import { AuthTokenModel } from "../../../shared/domains/auth-token/auth-token.model";
import { addToUniqueIndex } from "../../utils/repository/modules/add-to-unique-index.helper";
import { updateUniqueIndex } from "../../utils/repository/modules/update-unique-index.helper";
import { Db } from "../../utils/db/db";

let __created__ = false;
@Service({ global: true })
export class AuthTokenRepository extends BaseRepository<AuthTokenModel> {
  private _index_user_id: Map<AuthTokenModel['user_id'], AuthTokenModel[]> = new Map();
  private _index_session_id: Map<AuthTokenModel['session_id'], AuthTokenModel> = new Map();

  /**
   * @constructor
   *
   * @param _idFactory
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => IdFactory) _idFactory: IdFactory,
    @Inject(() => ServerEventBus) _eb: ServerEventBus,
    @Inject(() => Db) _db: Db,
  ) {
    super(_db, _idFactory, AuthTokenModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
    Array.from(this.table).forEach(([, model]) => this._onCreateHook(model));
  }

  /** @inheritdoc */
  protected _onCreateHook(created: Readonly<AuthTokenModel>) {
    addToManyIndex(this._index_user_id, created, 'user_id');
    addToUniqueIndex(this._index_session_id, created, 'session_id');
  }

  /** @inheritdoc */
  protected _onUpdateHook(models: { old: Readonly<AuthTokenModel>, new: Readonly<AuthTokenModel> }) {
    updateManyIndex(this._index_user_id, models, 'user_id');
    updateUniqueIndex(this._index_session_id, models, 'session_id');
  }

  /** @inheritdoc */
  protected _onDeleteHook(models: { old: Readonly<AuthTokenModel>, new: Readonly<AuthTokenModel> }) {
    updateManyIndex(this._index_user_id, models, 'user_id');
    updateUniqueIndex(this._index_session_id, models, 'session_id');
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param arg 
   */
  async findBySessionId(arg: { session_id: string }): Promise<AuthTokenModel | null> {
    const user = await this._index_session_id.get(arg.session_id);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param arg 
   */
  async findOrFailBySessionId(arg: { session_id: string }): Promise<AuthTokenModel> {
    const user = await this._index_session_id.get(arg.session_id);
    if (!user) throw new ReferenceError(`Failed to find ${AuthTokenModel.name} with original_session_id "${arg.session_id}"`);
    return user;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param arg 
   */
  async findByUserId(arg: { user_id: string }): Promise<AuthTokenModel[] | null> {
    const user = await this._index_user_id.get(arg.user_id);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param arg 
   */
  async findOrFailByUserId(arg: { user_id: string }): Promise<AuthTokenModel[]> {
    const user = await this._index_user_id.get(arg.user_id);
    if (!user) throw new ReferenceError(`Failed to find ${AuthTokenModel.name} with user_id "${arg.user_id}"`);
    return user;
  }
}
