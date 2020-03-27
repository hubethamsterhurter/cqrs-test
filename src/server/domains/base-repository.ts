import { ModelType } from '../../shared/domains/model.type';
import { IdFactory } from "../../shared/helpers/id.factory";
import { ClassType } from "class-transformer/ClassTransformer";
import { plainToClass, classToPlain } from "class-transformer";
import { $DANGER } from "../../shared/types/danger.type";
import { ServerEventBus } from "../global/event-bus/server-event-bus";
import { Model } from "../../shared/domains/model";
import { ServerEventModelCreated } from "../events/models/server-event.model-created";
import { ServerEventModelUpdated } from "../events/models/server-event.model-updated";
import { ServerEventModelDeleted } from "../events/models/server-event.model-deleted";
import { WithoutId } from '../../shared/types/without-id.type';
import { ClassLogger } from '../../shared/helpers/class-logger.helper';

function cloneFromPlain<M extends ModelType>(Ctor: ClassType<M>, rawModel: WithoutId<ModelType>, id: string): M {
  const cloned = plainToClass(Ctor, rawModel) as $DANGER<M>;
  (cloned as $DANGER<any>).id = id;
  return cloned;
}

function cloneFromClass<M>(Ctor: ClassType<M>, model: M): M {
  const cloned = plainToClass(Ctor, classToPlain(model));
  return cloned;
}

export abstract class BaseRepository<M extends Model> {
  private readonly _log = new ClassLogger(this);
  private readonly _table: Map<string, M> = new Map();

  /**
   * @constructor
   *
   * @param _idFactory
   * @param _ModelCTor
   */
  constructor(
    protected readonly _idFactory: IdFactory,
    protected readonly _ModelCTor: ClassType<M>,
    protected readonly _eb: ServerEventBus,
  ) {}

  /**
   * @description
   * Create a model
   *
   * @param rawModel
   */
  async create(rawModel: WithoutId<M>): Promise<M> {
    const id = this._idFactory.create();
    const cloned = cloneFromPlain(this._ModelCTor, classToPlain(rawModel), id);
    this._log.info(`Creating`, id, this._ModelCTor.name);
    this._table.set(cloned.id, cloned);
    this._eb.fire(new ServerEventModelCreated({ CTor: this._ModelCTor, model: cloned }));
    return cloned;
  }

  /**
   * @description
   * Upsert a model
   *
   * @param model 
   */
  async upsert(model: M): Promise<M> {
    const cloned = cloneFromClass(this._ModelCTor, model);
    this._log.info(`Upserting ${this._ModelCTor.name} - ${model.id}`);
    this._table.set(cloned.id, model);
    this._eb.fire(new ServerEventModelUpdated({ CTor: this._ModelCTor, model: cloned }));
    return cloned;
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
   * Find all
   *
   * @param id
   */
  async findAll(): Promise<M[]> {
    this._log.info(`Finding all`, this._ModelCTor.name);
    const result = Array
      .from(this._table)
      .map(([,model]) => cloneFromClass(this._ModelCTor, model));
    return result;
  }

  /**
   * @description
   * Delete one
   *
   * @param id
   */
  async delete(id: string): Promise<boolean> {
    this._log.info('Deleting', id, this._ModelCTor.name);
    const had = this._table.has(id);
    this._table.delete(id);
    if (had) this._eb.fire(new ServerEventModelDeleted({ CTor: this._ModelCTor, id, }));
    return had;
  }
}