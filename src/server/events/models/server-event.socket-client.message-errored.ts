import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { SocketClient } from "../../global/socket-client/socket-client";

interface Payload { socket: SocketClient, err: Error };

export class ServerEventSocketClientMessageMalformed implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_CLIENT_MESSAGE_MALFORMED'], Payload> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_MESSAGE_MALFORMED;
  constructor(readonly _p: Payload) {}
}
