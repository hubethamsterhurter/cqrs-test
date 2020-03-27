
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { SocketClient } from "../../global/socket-client/socket-client";

interface Payload { client: SocketClient };

export class ServerEventSocketClientUnexpectedResponse implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_CLIENT_UNEXPECTED_RESPONSE'], Payload> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_UNEXPECTED_RESPONSE;
  constructor(readonly _p: Payload) {}
}
