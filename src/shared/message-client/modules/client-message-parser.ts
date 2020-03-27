import { MessageParser } from "../../helpers/message-parser.helper";
import { A_VER } from "../../constants/ver";
import { A_CLIENT_MESSAGE_TYPE } from "./client-message-type";
import { ClientMessage, clientMessageRegistry } from "./client-message-registry";
import { Service } from "typedi";

let __created__ = false;
@Service({ global: true })
export class ClientMessageParser extends MessageParser<A_VER, A_CLIENT_MESSAGE_TYPE, ClientMessage> {
  constructor() {
    super(clientMessageRegistry);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
