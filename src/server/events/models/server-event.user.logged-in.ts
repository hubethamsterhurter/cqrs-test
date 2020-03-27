import { VER } from "../../../shared/constants/ver";
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { UserModel } from "../../../shared/domains/user/user.model";

interface Payload { user: UserModel }

const _v = VER._0_1;
const _t = SERVER_EVENT_TYPE.USER_LOGGED_IN;

export class ServerEventUserLoggedIn implements EventType<VER['_0_1'], SERVER_EVET_TYPE['USER_LOGGED_IN'], Payload> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  readonly _v = ServerEventUserLoggedIn._v;
  readonly _t = ServerEventUserLoggedIn._t;

  constructor(readonly _p: Payload) {}
}
