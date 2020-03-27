import { VER } from "../../../shared/constants/ver";
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { SocketClient } from "../../global/socket-client/socket-client";
import { UserModel } from "../../../shared/domains/user/user.model";

interface Payload { socket: SocketClient, user: UserModel }

const _v = VER._0_1;
const _t = SERVER_EVENT_TYPE.USER_SIGNED_UP;

export class ServerEventUserSignedUp implements EventType<VER['_0_1'], SERVER_EVET_TYPE['USER_SIGNED_UP'], Payload> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  readonly _v = ServerEventUserSignedUp._v;
  readonly _t = ServerEventUserSignedUp._t;

  constructor(readonly _p: Payload) {}
}
