import * as op from 'rxjs/operators';
import fs from 'fs';
import { Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { timer, BehaviorSubject } from "rxjs";
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { plainToClass } from 'class-transformer';
import { Constructor } from '../../../shared/types/constructor.type';
import { IModel } from '../../../shared/interfaces/interface.model';

function tableName(Ctor: Constructor<any>) {
  return `${Ctor.name}.json`;
}

type MemoryTable<T extends IModel = IModel> = Map<string, T>;

const DB_SYNC_THROTTLE = 5000;
const DB_DIR = `${__dirname}/../../../../db`;

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class Db {
  readonly #log = new Logger(this);
  readonly #syncBuffer$ = new BehaviorSubject<Set<Constructor<IModel>>>(new Set());
  readonly #memoryTables: Map<Constructor<IModel>, MemoryTable> = new Map();

  /**
   * @param _dir 
   */
  constructor(private readonly _dir: string) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    this
      .#syncBuffer$
      .pipe(
        op.filter((buffer) => buffer.size > 0),
        op.throttle(() => timer(DB_SYNC_THROTTLE), { leading: true, trailing: true }),
      )
      .subscribe(async (buffer) => {
        for (const ref of buffer) {
          buffer.delete(ref);
          if (!this.#memoryTables.has(ref)) continue;
          this.#log.info(`Writing ${tableName(ref)} to db...`);
          const tableStr = JSON.stringify(Array.from(this.#memoryTables.get(ref)!.values()), null, 2);
          await new Promise((res, rej) => fs.writeFile(
              this._tablePath(ref),
              tableStr,
              (err) => (err) ? rej(err) : res(),
            )).then(
              () => { this.#log.info(`...Wrote ${tableName(ref)} to db`); },
              (err) => { this.#log.error(`...Failed writing ${tableName(ref)} to db`, err); },
            )
        }
      });
  }

  /**
   * @description
   * Get the path for a table
   *
   * @param Ctor
   */
  private _tablePath(Ctor: Constructor<IModel>) {
    return `${DB_DIR}/${tableName(Ctor)}`;
  }

  /**
   * @description
   * Sync a table to persistant storage
   * 
   * @param memTable 
   */
  sync(TableModelName: Constructor<IModel>) {
    this.#syncBuffer$.next(this.#syncBuffer$.getValue().add(TableModelName));
  }

  /**
   * @description
   * Retrieve a table from persistant storage
   *
   * @param TableModelCtor
   */
  init<T extends IModel>(TableModelCtor: Constructor<T>): MemoryTable<T> {
    let memTable: Map<string, T> = new Map();

    // read
    try {
      const json: T[] = JSON.parse(fs.readFileSync(this._tablePath(TableModelCtor), {}).toString());
      this.#log.info(`loaded table ${TableModelCtor.name} from fs`, json, json.map);
      memTable = new Map(json.map((v) => [v.id, plainToClass(TableModelCtor, v)]));
    } catch (err) {
      this.#log.info(`Unable to read table ${tableName(TableModelCtor)} from fs ${err}.`, err);
    }

    this.#memoryTables.set(TableModelCtor, memTable);

    return memTable;
  }
}