import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { BaseRepository } from "../../utils/repository/base-repository";
import { addToManyIndex } from "../../utils/repository/modules/add-to-many-index.helper";
import { updateManyIndex } from "../../utils/repository/modules/update-many-index.helper";
import { AuthTokenModel } from "../../../shared/domains/auth-token/auth-token.model";

let __created__ = false;
@Service({ global: true })
export class AuthTokenRepository extends BaseRepository<AuthTokenModel> {
  private _index_user_id: Map<AuthTokenModel['user_id'], AuthTokenModel[]> = new Map();

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
    super(_idFactory, AuthTokenModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  /** @inheritdoc */
  protected _onCreateHook(created: Readonly<AuthTokenModel>) {
    addToManyIndex(this._index_user_id, created, 'user_id');
  }

  /** @inheritdoc */
  protected _onUpdateHook(models: { old: Readonly<AuthTokenModel>, new: Readonly<AuthTokenModel> }) {
    updateManyIndex(this._index_user_id, models, 'user_id');
  }

  /** @inheritdoc */
  protected _onDeleteHook(models: { old: Readonly<AuthTokenModel>, new: Readonly<AuthTokenModel> }) {
    updateManyIndex(this._index_user_id, models, 'user_id');
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param user_id 
   */
  async findByUserId(user_id: string): Promise<AuthTokenModel[] | null> {
    const user = await this._index_user_id.get(user_id);
    return user ?? null;
  }

  /**
   * @description
   * Find a user by user_id
   * 
   * @param user_id 
   */
  async findOrFailByUserId(user_id: string): Promise<AuthTokenModel[]> {
    const user = await this._index_user_id.get(user_id);
    if (!user) throw new ReferenceError(`Failed to find ${AuthTokenModel.name} with user_id "${user_id}"`);
    return user;
  }
}
