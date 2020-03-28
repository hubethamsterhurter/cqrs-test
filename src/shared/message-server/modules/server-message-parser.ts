import { RegistryParser } from "../../helpers/registry-parser.helper";
import { ServerMessageCtor, ServerMessageRegistry } from "./server-message-registry";
import Container, { Service, Inject } from "typedi";
import { LogConstruction } from "../../decorators/log-construction.decorator";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerMessageParser extends RegistryParser<ServerMessageCtor> {

  /**
   * @constructor
   *
   * @param registry 
   */
  constructor(
    // @Inject(() => ServerMessageRegistry) registry: ServerMessageRegistry
  ) {
    // @fix fix for CRA decorator support
    // super(registry);
    super(Container.get(ServerMessageRegistry));
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
