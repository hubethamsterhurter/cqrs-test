import { ClientMessageCreateUser } from "../models/client-message.create-user";
import { ClientMessageUpdateUser } from "../models/client-message.update-user";
import { A_VER } from "../../constants/ver";
import { A_CLIENT_MESSAGE_TYPE } from "./client-message-type";
import { createMessageRegistry, registerMessage } from "../../helpers/message-registry.helper";
import { ClientMessageUserTyping } from "../models/client-message.user-typing";
import { ClientMessageCreateChat } from "../models/client-message.create-chat";

export type ClientMessage =
  | ClientMessageCreateUser
  | ClientMessageUpdateUser
  | ClientMessageUserTyping
  | ClientMessageCreateChat;

// map
export const clientMessageRegistry = createMessageRegistry<A_VER, A_CLIENT_MESSAGE_TYPE, ClientMessage>();

registerMessage(clientMessageRegistry, ClientMessageCreateUser);
registerMessage(clientMessageRegistry, ClientMessageUpdateUser);
registerMessage(clientMessageRegistry, ClientMessageUserTyping);
registerMessage(clientMessageRegistry, ClientMessageCreateChat);