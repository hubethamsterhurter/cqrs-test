import { LogConstruction } from "../decorators/log-construction.decorator";
import Container, { Service } from "typedi";
import { RegistryParser } from "../helpers/registry-parser.helper";
import { MessageRegistry } from "./message-registry.util";
import { BaseMessage } from "../base/base.message";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class MessageParser<M extends BaseMessage = BaseMessage> extends RegistryParser<M> {
  /**
   * @constructor
   */
  constructor() {
    const registry: MessageRegistry<M> = Container.get(MessageRegistry) as MessageRegistry<M>;
    super(registry);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
