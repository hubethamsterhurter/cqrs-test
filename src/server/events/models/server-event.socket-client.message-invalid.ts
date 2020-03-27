import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";
import { SocketClient } from "../../global/socket-client/socket-client";
import { ValidationError } from "class-validator";
import { ClassType } from "class-transformer/ClassTransformer";
import { ClientMessage } from "../../../shared/message-client/modules/client-message-registry";

interface Payload { socket: SocketClient, errs: ValidationError[], Ctor: ClassType<ClientMessage> };

export class ServerEventSocketClientMessageInvalid implements EventType<VER['_0_1'], SERVER_EVET_TYPE['SOCKET_CLIENT_MESSAGE_INVALID'], Payload> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_MESSAGE_INVALID;
  constructor(readonly _p: Payload) {}
}
