import { MessageParser } from "../../helpers/message-parser.helper";
import { A_VER } from "../../constants/ver";
import { A_SERVER_MESSAGE_TYPE } from "./server-message-type";
import { ServerMessage, serverMessageRegistry } from "./server-message-registry";
import { Service } from "typedi";

let __created__ = false;
@Service({ global: true })
export class ServerMessageParser extends MessageParser<A_VER, A_SERVER_MESSAGE_TYPE, ServerMessage> {
  constructor() {
    super(serverMessageRegistry);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}