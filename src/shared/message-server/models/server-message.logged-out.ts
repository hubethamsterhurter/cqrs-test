import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { Equals } from "class-validator";
import { VER } from "../../constants/ver";

const _v = VER._0_1;
const _t = SERVER_MESSAGE_TYPE.LOGGED_OUT

export class ServerMessageLoggedOut implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['LOGGED_OUT']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals( _v) readonly _v = ServerMessageLoggedOut._v;
  @Equals( _t) readonly _t = ServerMessageLoggedOut._t;

  /**
   * @constructor
   *
   * @param props
   */
  constructor() {}
}