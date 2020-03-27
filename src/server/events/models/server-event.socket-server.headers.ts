import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { IncomingMessage } from "http";


export class ServerEventSocketServerHeaders implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_SERVER_HEADERS'], { req: IncomingMessage, headers: string[], }> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_SERVER_HEADERS;
  constructor(readonly _p: { req: IncomingMessage, headers: string[] }) {}
}