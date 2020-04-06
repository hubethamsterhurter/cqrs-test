import { plainToClass, classToPlain } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { IdFactory } from '../../../shared/helpers/id.factory';
import { ServerEventBus } from '../../global/event-bus/server-event-bus';
import { UnsavedModel } from '../../../shared/types/unsaved-model.type';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { ModelCreatedSeo, ModelCreatedSeDto } from '../../events/models/model-created.seo';
import { $FIX_ME } from '../../../shared/types/fix-me.type';
import { ModelUpdatedSeo, ModelUpdatedSeDto } from '../../events/models/model-updated.seo';
import { ModelDeletedSeo, ModelDeletedSeDto } from '../../events/models/model-deleted.seo';
import { UserModel } from '../../../shared/domains/user/user.model';
import { IModel } from '../../../shared/interfaces/interface.model';
import { Db } from '../db/db';
import { Constructor } from '../../../shared/types/constructor.type';

function clone<M>(Ctor: ClassType<M>, model: M): M {
  const cloned = plainToClass(Ctor, classToPlain(model));
  return cloned;
}

/**
 * TODO: soft delete scope
 * TODO: sync to FS & serialize on reboot
 */
export abstract class BaseRepository<M extends IModel> {
  readonly #log = new Logger(this);
  private readonly _table: Map<string, M>;

  protected get table(): Map<string, M> { return this._table }

  /**
   * @description
   * Hook into model creation
   * 
   * @param createdModel 
   */
  protected _onCreateHook(createdModel: Readonly<M>) {}

  /**
   * @description
   * Hook into model update
   * 
   * @param createdModel 
   */
  protected _onUpdateHook(models: { readonly old: Readonly<M>, readonly new: Readonly<M> }) {}

  /**
   * @description
   * Hook into model delete
   * 
   * @param createdModel 
   */
  protected _onDeleteHook(models: { readonly old: Readonly<M>, readonly new: Readonly<M> }) {}

  /**
   * @constructor
   *
   * @param _idFactory
   * @param _ModelCTor
   * @param _eb
   */
  constructor(
    protected readonly _db: Db,
    protected readonly _idFactory: IdFactory,
    protected readonly _ModelCTor: Constructor<M>,
    protected readonly _eb: ServerEventBus,
  ) {
    this._table = _db.init(_ModelCTor);
  }



  /**
   * @description
   * Clone the instance
   *
   * @param instance
   */
  private _clone(instance: M) { return clone(this._ModelCTor, instance); }



  /**
   * @description
   * Sync to persistance layer
   *
   * @param instance
   */
  private _sync() { this._db.sync(this._ModelCTor); }



  /**
   * @description
   * Find a model
   *
   * @param id
   */
  protected _find(id: string) {
    return this._table.get(id);
  }



  /**
   * @description
   * Create a model
   *
   * @param inModel
   * @param forceId
   * @param requester
   * @param trace
   */
  async create(arg: {
    inModel: UnsavedModel<M>,
    forceId: string | undefined,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<M> {
    const id = arg.forceId || this._idFactory.create();
    const now = new Date();
    const preparedModel: M = {
      ...arg.inModel,
      _n: this._ModelCTor.name,
      id,
      created_at: now,
      created_by_id: arg.requester?.id ?? null,
      updated_at: now,
      updated_by_id: arg.requester?.id ?? null,
      deleted_at: null,
      deleted_by_id: null,
    } as $FIX_ME<M>;
    const newModel = plainToClass(this._ModelCTor, preparedModel);
    this.#log.info(`Creating`, id, this._ModelCTor.name);
    this._table.set(newModel.id, newModel);
    this._onCreateHook(clone(this._ModelCTor, newModel));
    this._eb.fire(new ModelCreatedSeo({
      dto: new ModelCreatedSeDto({ model: clone(this._ModelCTor, newModel), }),
      trace: arg.trace.clone(),
    }));
    this._sync();
    return clone(this._ModelCTor, newModel);
  }


  /**
   * @description
   * Upsert a model
   *
   * @param arg
   */
  async update(arg: {
    id: string,
    fill: Partial<UnsavedModel<M>>,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<M> {
    // const updatedModel = clone(this._ModelCTor, arg.id);
    const match = this._table.get(arg.id);
    if (!match) { throw new Error(`Cannot update ${this._ModelCTor.name}.${arg.id}: not found`); }
    const updated = plainToClass(this._ModelCTor, { ...match, ...arg.fill });
    const now = new Date();
    updated.updated_at = now;
    updated.updated_by_id = arg.requester?.id ?? null;
    this._table.set(updated.id, updated);
    this.#log.info(`Updating ${this._ModelCTor.name} - ${arg.id}`);
    this._onUpdateHook({ old: match, new: this._clone(updated) })
    this._eb.fire(new ModelUpdatedSeo({
      dto: new ModelUpdatedSeDto({
        model: this._clone(updated),
      }),
      trace: arg.trace.clone(),
    }));
    this._sync();
    return this._clone(updated);
  }


  /**
   * @description
   * Find one
   *
   * @param id
   */
  async findOne(arg: { id: string }): Promise<M | null> {
    this.#log.info(`Finding`, this._ModelCTor.name, arg.id);
    const found = this._table.get(arg.id);
    return found ? this._clone(found) : null;
  }


  /**
   * @description
   * Find one
   *
   * @param id
   */
  async findOneOrFail(arg: { id: string }): Promise<M> {
    this.#log.info(`Getting`, this._ModelCTor.name, arg.id);
    const found = this._table.get(arg.id);
    if (!found) throw new ReferenceError(`Unable to find ${this._ModelCTor.name} with id ${arg.id}`);
    return this._clone(found);
  }


  /**
   * @description
   * Find all
   */
  async findAll(): Promise<M[]> {
    this.#log.info(`Finding all`, this._ModelCTor.name);
    const result = Array
      .from(this._table)
      .map(([,model]) => this._clone(model));
    return result;
  }


  /**
   * @description
   * Delete one
   *
   * only soft delete
   * 
   * ensure no side effects
   *
   * @arg
   */
  async delete(arg: {
    id: string,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<M | null> {
    this.#log.info('Deleting', this._ModelCTor.name, arg.id);
    let match = this._table.get(arg.id);

    //not found
    if (!match) { return null; }

    const deleted = this._clone(match);

    // already deleted
    if (deleted.deleted_at) { return this._clone(deleted); }

    deleted.deleted_at = new Date();
    deleted.deleted_by_id = arg.requester?.id ?? null;
    this._table.set(deleted.id, deleted);
    this._onDeleteHook({ old: match, new: deleted  });
    this._eb.fire(new ModelDeletedSeo({
      dto: new ModelDeletedSeDto({
        model: clone(this._ModelCTor, deleted),
      }),
      trace: arg.trace.clone()
    }));
    this._sync();
    return clone(this._ModelCTor, deleted);
  }
}