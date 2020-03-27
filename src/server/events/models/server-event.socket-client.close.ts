
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { SocketClient } from "../../global/socket-client/socket-client";


// socket client event
export class ServerEventSocketClientClose implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_CLIENT_CLOSE'], { client: SocketClient, code: number, reason: string }> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_CLOSE;
  constructor(readonly _p: { client: SocketClient, code: number, reason: string }) {}
}