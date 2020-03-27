import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { SocketClient } from "../../global/socket-client/socket-client";

export class ServerEventSocketClientOpen implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_CLIENT_OPEN'], { client: SocketClient }> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_OPEN;
  constructor(readonly _p: { client: SocketClient }) {}
}
