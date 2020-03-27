import { VER } from "../../../shared/constants/ver";
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { UserModel } from "../../../shared/domains/user/user.model";

interface Payload { user: UserModel }

const _v = VER._0_1;
const _t = SERVER_EVENT_TYPE.USER_LOGGED_OUT;

export class ServerEventUserLoggedOut implements EventType<VER['_0_1'], SERVER_EVET_TYPE['USER_LOGGED_OUT'], Payload> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  readonly _v = ServerEventUserLoggedOut._v;
  readonly _t = ServerEventUserLoggedOut._t;

  constructor(readonly _p: Payload) {}
}
