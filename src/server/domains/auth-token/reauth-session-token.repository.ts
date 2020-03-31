import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { BaseRepository } from "../../utils/repository/base-repository";
import { addToManyIndex } from "../../utils/repository/modules/add-to-many-index.helper";
import { updateManyIndex } from "../../utils/repository/modules/update-many-index.helper";
import { ReauthSessionTokenModel } from "../../../shared/domains/auth-token/reauth-session-token.model";
import { addToUniqueIndex } from "../../utils/repository/modules/add-to-unique-index.helper";
import { updateUniqueIndex } from "../../utils/repository/modules/update-unique-index.helper";

let __created__ = false;
@Service({ global: true })
export class ReauthSessionTokenRepository extends BaseRepository<ReauthSessionTokenModel> {
  private _index_user_id: Map<ReauthSessionTokenModel['user_id'], ReauthSessionTokenModel[]> = new Map();
  private _index_session_id: Map<ReauthSessionTokenModel['session_id'], ReauthSessionTokenModel> = new Map();

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
    super(_idFactory, ReauthSessionTokenModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
    Array.from(this.table).forEach(([, model]) => this._onCreateHook(model));
  }

  /** @inheritdoc */
  protected _onCreateHook(created: Readonly<ReauthSessionTokenModel>) {
    addToManyIndex(this._index_user_id, created, 'user_id');
    addToUniqueIndex(this._index_session_id, created, 'session_id');
  }

  /** @inheritdoc */
  protected _onUpdateHook(models: { old: Readonly<ReauthSessionTokenModel>, new: Readonly<ReauthSessionTokenModel> }) {
    updateManyIndex(this._index_user_id, models, 'user_id');
    updateUniqueIndex(this._index_session_id, models, 'session_id');
  }

  /** @inheritdoc */
  protected _onDeleteHook(models: { old: Readonly<ReauthSessionTokenModel>, new: Readonly<ReauthSessionTokenModel> }) {
    updateManyIndex(this._index_user_id, models, 'user_id');
    updateUniqueIndex(this._index_session_id, models, 'session_id');
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param original_session_id 
   */
  async findByOriginalSessionId(original_session_id: string): Promise<ReauthSessionTokenModel | null> {
    const user = await this._index_session_id.get(original_session_id);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param original_session_id 
   */
  async findOrFailByOriginalSessionId(original_session_id: string): Promise<ReauthSessionTokenModel> {
    const user = await this._index_session_id.get(original_session_id);
    if (!user) throw new ReferenceError(`Failed to find ${ReauthSessionTokenModel.name} with original_session_id "${original_session_id}"`);
    return user;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param user_id 
   */
  async findByUserId(user_id: string): Promise<ReauthSessionTokenModel[] | null> {
    const user = await this._index_user_id.get(user_id);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param user_id 
   */
  async findOrFailByUserId(user_id: string): Promise<ReauthSessionTokenModel[]> {
    const user = await this._index_user_id.get(user_id);
    if (!user) throw new ReferenceError(`Failed to find ${ReauthSessionTokenModel.name} with user_id "${user_id}"`);
    return user;
  }
}
