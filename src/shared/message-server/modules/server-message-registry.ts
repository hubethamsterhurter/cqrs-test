import { A_VER } from "../../constants/ver";
import { A_SERVER_MESSAGE_TYPE } from "./server-message-type";
import { createMessageRegistry, registerMessage } from "../../helpers/message-registry.helper";
import { ServerMessageUserCreated } from "../models/server-message.user.created";
import { ServerMessageUserUpdated } from "../models/server-message.user.updated";
import { ServerMessageUserTyping } from "../models/server-message.user.typing";
import { ServerMessageChatCreated } from "../models/server-message.chat.created";
import { ServerMessageSocketConnection } from "../models/server-message.socket-connection";
import { ServerMessageInit } from '../models/server-message.init';
import { ServerMessageServerHeartbeat } from "../models/server-message.server-heartbeat";

export type ServerMessage =
  | ServerMessageUserCreated
  | ServerMessageUserUpdated
  | ServerMessageUserTyping
  | ServerMessageChatCreated
  | ServerMessageSocketConnection
  | ServerMessageInit
  | ServerMessageServerHeartbeat;

// map
export const serverMessageRegistry = createMessageRegistry<A_VER, A_SERVER_MESSAGE_TYPE, ServerMessage>();

registerMessage(serverMessageRegistry, ServerMessageUserCreated);
registerMessage(serverMessageRegistry, ServerMessageUserUpdated);
registerMessage(serverMessageRegistry, ServerMessageUserTyping);
registerMessage(serverMessageRegistry, ServerMessageChatCreated);
registerMessage(serverMessageRegistry, ServerMessageSocketConnection);
registerMessage(serverMessageRegistry, ServerMessageInit);
registerMessage(serverMessageRegistry, ServerMessageServerHeartbeat);