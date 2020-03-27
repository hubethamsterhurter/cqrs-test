import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { VER } from "../../constants/ver";
import { Equals } from "class-validator";

const _v = VER._0_1;
const _t = CLIENT_MESSAGE_TYPE.TYPING;

export class ClientMessageUserTyping implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['TYPING']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(_v) readonly _v = ClientMessageUserTyping._v;
  @Equals(_t) readonly _t = ClientMessageUserTyping._t;
}
