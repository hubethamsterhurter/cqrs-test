import { UToKV } from "../types/u-to-kv.type";
import { $DANGER } from "../types/danger.type";
import { LogConstruction } from "../decorators/log-construction.decorator";

@LogConstruction()
export abstract class Registry<T extends Record<PropertyKey, any>, K extends keyof T> {
  #r: Map<K, T>;

  /**
   * @constructor
   *
   * @param initial
   * @param _k
   */
  constructor(
    initial: T[] = [],
    private _k: K,
  ) {
    const entries = initial.map(val => [val[_k], val] as const);
    this.#r = new Map(entries);
  }

  find<U extends T[K]>(key: U): undefined | UToKV<T, K>[U] {
    const found = this.#r.get(key) as $DANGER<undefined | UToKV<T, K>[U]>;
    return found;
  }

  get<U extends T[K]>(key: U): UToKV<T, K>[U] {
    const found = this.#r.get(key) as $DANGER<undefined | UToKV<T, K>[U]>;
    if (!found) throw new ReferenceError(`Cannot find key "${key}" in "${this.constructor.name}"`);
    return found;
  }
}