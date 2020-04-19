import { Constructor } from "../types/constructor.type";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { Service } from "typedi";
import { BaseMessage } from "../base/base.message";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class MessageRegistry<M extends BaseMessage = BaseMessage> {
  #registry: Map<string, Constructor<M>> = new Map();

  /**
   * @constructor
   */
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  /**
   * @description
   * Add a message to the registry
   *
   * @param arg
   */
  add(CmCtor: Constructor<M>) {
    this.#registry.set(CmCtor.name, CmCtor);
  }

  /**
   * @description
   * Retrieve a message from the registry
   *
   * @param arg
   */
  get(ctorName: string) {
    return this.#registry.get(ctorName);
  }
}