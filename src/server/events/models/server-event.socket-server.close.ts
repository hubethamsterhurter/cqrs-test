import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";

// socket server events 
export class ServerEventSocketServerClose implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_SERVER_CLOSE'], undefined> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_SERVER_CLOSE;
  constructor(readonly _p: undefined = undefined) {}
}