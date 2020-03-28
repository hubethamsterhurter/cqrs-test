import { RegistryParser } from "../../helpers/registry-parser.helper";
import Container, { Service, Inject } from "typedi";
import { ClientMessageRegistry, ClientMessageCtor } from "./client-message-registry";
import { LogConstruction } from "../../decorators/log-construction.decorator";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ClientMessageParser extends RegistryParser<ClientMessageCtor> {

  /**
   * @constructor
   *
   * @param registry 
   */
  constructor(
    // @Inject(() => ClientMessageRegistry) registry: ClientMessageRegistry
  ) {
    // @fix for CRA decorator support
    // super(registry);
    super(Container.get(ClientMessageRegistry));
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
