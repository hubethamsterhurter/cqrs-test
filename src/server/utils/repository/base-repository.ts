import * as op from 'rxjs/operators';
import fs from 'fs';
import { plainToClass, classToPlain } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { Subject, timer } from 'rxjs';
import { IdFactory } from '../../../shared/helpers/id.factory';
import { ServerEventBus } from '../../global/event-bus/server-event-bus';
import { $DANGER } from '../../../shared/types/danger.type';
import { UnsavedModel } from '../../../shared/types/unsaved-model.type';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { ModelCreatedSeo, ModelCreatedSeDto } from '../../events/models/model-created.seo';
import { $FIX_ME } from '../../../shared/types/fix-me.type';
import { ModelUpdatedSeo, ModelUpdatedSeDto } from '../../events/models/model-updated.seo';
import { ModelDeletedSeo, ModelDeletedSeDto } from '../../events/models/model-deleted.seo';
import { UserModel } from '../../../shared/domains/user/user.model';
import { IModel } from '../../../shared/interfaces/interface.model';

function clone<M>(Ctor: ClassType<M>, model: M): M {
  const cloned = plainToClass(Ctor, classToPlain(model));
  return cloned;
}

const TABLE_DIR = `${__dirname}/../../../../db`;

// 5 sec
const SYNC_THROTTLE_TIME = 5000;

/**
 * TODO: soft delete scope
 * TODO: sync to FS & serialize on reboot
 */
export abstract class BaseRepository<M extends IModel> {
  private readonly _log = new Logger(this);
  private readonly _table: Map<string, M>;
  private readonly _save$: Subject<undefined> = new Subject();
  private readonly _tableFile: string;

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
    protected readonly _idFactory: IdFactory,
    protected readonly _ModelCTor: ClassType<M>,
    protected readonly _eb: ServerEventBus,
  ) {
    this._tableFile = `${TABLE_DIR}/${this._ModelCTor.name.toLowerCase()}.json`;
    // 1 -
    // read sync from FS on boot
    // TODO: find more efficient way to do this...
    try {
      const result = JSON.parse(fs.readFileSync(this._tableFile, { }).toString());
      // TODO: validate result shape (should be entries)
      this._log.info(`loaded table ${this._ModelCTor.name.toLowerCase()} from fs`, result)
      this._table = new Map(result.map(([k, v]: $DANGER<any>) => [k, plainToClass(this._ModelCTor, v)]));
    } catch (err) {
      // TODO: check if file is readable & lock instead of try catch
      this._log.info(`Unable to read table ${this._ModelCTor.name.toLowerCase()} from fs ${err}.`, err);
      this._table = new Map();
    }

    // 2 - set throttled syncs to fs
    // TODO: find more efficient way to do this...
    this
      ._save$
      .pipe(op.throttle(() => timer(SYNC_THROTTLE_TIME), { leading: true, trailing: true }))
      .subscribe(async () => {
        const entries = Array.from(this._table.entries());
        const entriesStr = JSON.stringify(entries, null, 2);
        new Promise((res, rej) => fs.writeFile(
          this._tableFile,
          entriesStr,
          (err) => (err) ? rej(err) : res(),
        )).then(
          () => { this._log.info(`Write ${this._ModelCTor.name} to db`); },
          (err) => { this._log.error(`Failed writing ${this._ModelCTor.name} to db`, err); },
        );
      });
  }


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
    this._log.info(`Creating`, id, this._ModelCTor.name);
    this._table.set(newModel.id, newModel);
    this._onCreateHook(clone(this._ModelCTor, newModel));
    this._eb.fire(new ModelCreatedSeo({
      dto: new ModelCreatedSeDto({ model: clone(this._ModelCTor, newModel), }),
      trace: arg.trace.clone(),
    }));
    this._save$.next();
    return clone(this._ModelCTor, newModel);
  }


  /**
   * @description
   * Upsert a model
   *
   * @param inModel 
   * @param requester
   * @param trace
   */
  async upsert(arg: {
    inModel: M,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<M> {
    const updatedModel = clone(this._ModelCTor, arg.inModel);
    const match = this._table.get(arg.inModel.id);
    const now = new Date();
    updatedModel.updated_at = now;
    updatedModel.updated_by_id = arg.requester?.id ?? null;
    if (match) {
      this._table.set(updatedModel.id, updatedModel);
      this._log.info(`Upserting ${this._ModelCTor.name} - ${arg.inModel.id}`);
      this._onUpdateHook({ old: match, new: clone(this._ModelCTor, updatedModel) })
    } else {
      (updatedModel as $DANGER<any>).created_at = now;
      (updatedModel as $DANGER<any>).created_by_id = arg.requester?.id ?? null;
      this._table.set(updatedModel.id, updatedModel);
      this._log.info(`Creating ${this._ModelCTor.name} - ${arg.inModel.id}`);
      this._onCreateHook(clone(this._ModelCTor, updatedModel));
    }
    this._eb.fire(new ModelUpdatedSeo({
      dto: new ModelUpdatedSeDto({
        model: clone(this._ModelCTor, updatedModel),
      }),
      trace: arg.trace.clone(),
    }));
    this._save$.next();
    return clone(this._ModelCTor, updatedModel);
  }


  /**
   * @description
   * Find one
   *
   * @param id
   */
  async findOne(arg: { id: string }): Promise<M | null> {
    this._log.info(`Finding`, arg.id, this._ModelCTor.name);
    const found = this._table.get(arg.id);
    return found ? clone(this._ModelCTor, found) : null;
  }


  /**
   * @description
   * Find one
   *
   * @param id
   */
  async findOneOrFail(arg: { id: string }): Promise<M> {
    this._log.info(`Finding (or failing)`, arg.id, this._ModelCTor.name);
    let found = this._table.get(arg.id);
    if (!found) throw new ReferenceError(`Unable to find ${this._ModelCTor.name} with id ${arg.id}`);
    return clone(this._ModelCTor, found);
  }


  /**
   * @description
   * Find all
   */
  async findAll(): Promise<M[]> {
    this._log.info(`Finding all`, this._ModelCTor.name);
    const result = Array
      .from(this._table)
      .map(([,model]) => clone(this._ModelCTor, model));
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
   * @param inModel
   * @param requester
   * @param trace
   */
  async delete(arg: {
    inModel: M,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<M | null> {
    this._log.info('Deleting', arg.inModel.id, this._ModelCTor.name);
    let match = this._table.get(arg.inModel.id);

    //not found
    if (!match) { return null; }

    const deletedModel = clone(this._ModelCTor, match);

    // already deleted
    if (deletedModel.deleted_at) { return clone(this._ModelCTor, deletedModel); }

    deletedModel.deleted_at = new Date();
    deletedModel.deleted_by_id = arg.requester?.id ?? null;
    this._table.set(deletedModel.id, deletedModel);
    this._onDeleteHook({ old: match, new: deletedModel  });
    this._eb.fire(new ModelDeletedSeo({
      dto: new ModelDeletedSeDto({
        model: clone(this._ModelCTor, deletedModel),
      }),
      trace: arg.trace.clone()
    }));
    this._save$.next();
    return clone(this._ModelCTor, deletedModel);
  }
}