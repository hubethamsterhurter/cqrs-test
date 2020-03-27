import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { VER } from "../../constants/ver";

export class ClientMessageUserTyping implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['TYPING']> {
  static get _v() { return VER._0_1; }
  static get _t() { return CLIENT_MESSAGE_TYPE.TYPING; }

  readonly _v = ClientMessageUserTyping._v;
  readonly _t = ClientMessageUserTyping._t;
}
