import { LogConstruction } from "../decorators/log-construction.decorator";
import Container, { Service } from "typedi";
import { RegistryParser } from "../helpers/registry-parser.helper";
import { IMessage } from "../interfaces/interface.message";
import { MessageRegistry } from "./message-registry.util";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class MessageParser<T extends IMessage = IMessage> extends RegistryParser<T> {
  /**
   * @constructor
   */
  constructor() {
    const registry: MessageRegistry<T> = Container.get(MessageRegistry) as MessageRegistry<T>;
    super(registry);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
