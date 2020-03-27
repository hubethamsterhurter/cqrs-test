import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";

export class ServerEventSocketServerError implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_SERVER_ERROR'], { readonly err: Error }> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_SERVER_ERROR;
  constructor(readonly _p: { err: Error }) {}
}