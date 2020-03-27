import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { SocketClient } from "../../global/socket-client/socket-client";
import { ClientMessage } from "../../../shared/message-client/modules/client-message-registry";
import { ClassType } from "class-transformer/ClassTransformer";

export class ServerEventSocketClientMessageParsed<M extends ClientMessage = ClientMessage> implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_CLIENT_MESSAGE_PARSED'], { client: SocketClient, message: M }> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_MESSAGE_PARSED;
  constructor(readonly _p: { client: SocketClient, message: M, Ctor: ClassType<M> }) {}
}