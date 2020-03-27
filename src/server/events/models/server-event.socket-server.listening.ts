import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";

export class ServerEventSocketServerListening implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_SERVER_LISTENING'], undefined> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_SERVER_LISTENING;
  constructor(readonly _p: undefined = undefined) {}
}