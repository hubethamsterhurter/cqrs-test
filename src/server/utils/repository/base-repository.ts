import * as op from 'rxjs/operators';
import fs from 'fs';
import { plainToClass, classToPlain } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { ClassLogger } from '../../../shared/helpers/class-logger.helper';
import { Model } from '../../../shared/domains/model';
import { Subject, timer } from 'rxjs';
import { IdFactory } from '../../../shared/helpers/id.factory';
import { ServerEventBus } from '../../global/event-bus/server-event-bus';
import { $DANGER } from '../../../shared/types/danger.type';
import { UnsavedModel } from '../../../shared/types/unsaved-model.type';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { ServerEventModelCreated } from '../../events/models/server-event.model-created';
import { $FIX_ME } from '../../../shared/types/fix-me.type';
import { ServerEventModelUpdated } from '../../events/models/server-event.model-updated';
import { ServerEventModelDeleted } from '../../events/models/server-event.model-deleted';

function cloneFromClass<M>(Ctor: ClassType<M>, model: M): M {
  const cloned = plainToClass(Ctor, classToPlain(model));
  return cloned;
}

const TABLE_DIR = `${__dirname}/../../../db`;

// 5 sec
const SYNC_THROTTLE_TIME = 5000;

/**
 * TODO: soft delete scope
 * TODO: sync to FS & serialize on reboot
 */
export abstract class BaseRepository<M extends Model> {
  private readonly _log = new ClassLogger(this);
  private readonly _table: Map<string, M>;
  private readonly _save$: Subject<undefined> = new Subject();
  private readonly _tableFile: string;

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
      for (const [,model] of this._table) { this._onCreateHook(model); }
    } catch (err) {
      // TODO: check if file is readable & lock instead of try catch
      this._log.info(`Unable to read table ${this._ModelCTor.name.toLowerCase()} from fs ${err}.`);
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
   * @param rawModel
   * @param forceId
   * @param trace
   */
  async create(
    rawModel: UnsavedModel<M>,
    forceId: string | undefined = undefined,
    trace: Trace,
  ): Promise<M> {
    const id = forceId || this._idFactory.create();
    const now = new Date();
    const preparedModel: M = {
      id,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      ...rawModel,
    } as unknown as $FIX_ME<M>
    const clonedModel = plainToClass(this._ModelCTor, preparedModel);
    this._log.info(`Creating`, id, this._ModelCTor.name);
    this._table.set(clonedModel.id, clonedModel);
    this._onCreateHook(clonedModel);
    this._eb.fire(new ServerEventModelCreated({
      _p: {
        CTor: this._ModelCTor,
        model: cloneFromClass(this._ModelCTor, clonedModel)
      },
      _o: trace.clone(),
    }));
    this._save$.next();
    return cloneFromClass(this._ModelCTor, clonedModel);
  }


  /**
   * @description
   * Upsert a model
   *
   * @param model 
   * @param trace
   */
  async upsert(
    model: M,
    trace: Trace,
  ): Promise<M> {
    const cloned = cloneFromClass(this._ModelCTor, model);
    cloned.updated_at = new Date();
    const match = this._table.get(model.id);
    this._table.set(cloned.id, cloned);

    if (match) {
      this._log.info(`Upserting ${this._ModelCTor.name} - ${model.id}`);
      this._onUpdateHook({ old: match, new: cloned })
    } else {
      this._log.info(`Creating ${this._ModelCTor.name} - ${model.id}`);
      this._onCreateHook(cloned)
    }

    this._eb.fire(new ServerEventModelUpdated({
      _p: {
        CTor: this._ModelCTor,
        model: cloneFromClass(this._ModelCTor, cloned)
      },
      _o: trace.clone(),
    }));
    this._save$.next();
    return cloneFromClass(this._ModelCTor, cloned);
  }


  /**
   * @description
   * Find one
   *
   * @param id
   */
  async findOne(id: string): Promise<M | null> {
    this._log.info(`Finding`, id, this._ModelCTor.name);
    let result: M | null = null;
    let found = this._table.get(id);
    if (found) { result = cloneFromClass(this._ModelCTor, found); }
    return result;
  }


  /**
   * @description
   * Find one
   *
   * @param id
   */
  async findOneOrFail(id: string): Promise<M> {
    this._log.info(`Finding (or failing)`, id, this._ModelCTor.name);
    let found = this._table.get(id);
    if (!found) throw new ReferenceError(`Unable to find ${this._ModelCTor.name} with id ${id}`);
    return cloneFromClass(this._ModelCTor, found);
  }


  /**
   * @description
   * Find all
   */
  async findAll(): Promise<M[]> {
    this._log.info(`Finding all`, this._ModelCTor.name);
    const result = Array
      .from(this._table)
      .map(([,model]) => cloneFromClass(this._ModelCTor, model));
    console.log(result);
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
   * @param model
   * @param trace
   */
  async delete(
    inputModel: M,
    trace: Trace,
  ): Promise<M | null> {
    this._log.info('Deleting', inputModel.id, this._ModelCTor.name);
    let match = this._table.get(inputModel.id);

    //not found
    if (!match) { return null; }

    const clone = cloneFromClass(this._ModelCTor, match);

    // already deleted
    if (clone.deleted_at) { return clone; }

    clone.deleted_at = new Date();
    this._table.set(clone.id, clone);
    this._onDeleteHook({ old: match, new: clone  });
    this._save$.next();

    this
      ._eb
      .fire(new ServerEventModelDeleted({
        _p: {
          CTor: this._ModelCTor,
          model: cloneFromClass(this._ModelCTor, clone),
        },
        _o: trace.clone()
      }));

    return cloneFromClass(this._ModelCTor, clone);
  }
}