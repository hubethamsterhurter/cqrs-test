import { Constructor } from "../types/constructor.type";
import { IMessage } from "../interfaces/interface.message";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { Service } from "typedi";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class MessageRegistry<T extends IMessage = IMessage> {
  #registry: Map<string, Constructor<T>> = new Map();

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
  add(CmCtor: Constructor<T>) {
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