import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { Equals } from "class-validator";
import { VER } from "../../constants/ver";

const _v = VER._0_1;
const _t = CLIENT_MESSAGE_TYPE.LOG_OUT;

export class ClientMessageLogOut implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['LOG_OUT']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(_v) readonly _v = ClientMessageLogOut._v;
  @Equals(_t) readonly _t = ClientMessageLogOut._t;

  /**
   * @constructor
   *
   * @param props
   */
  constructor() {}
}
