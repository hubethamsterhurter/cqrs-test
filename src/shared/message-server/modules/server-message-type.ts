import { MessageType } from "../../types/message.type";
import { Model } from "../../domains/model";

export const SERVER_MESSAGE_TYPE = {
  MODEL_CREATED: 'model_created',
  MODEL_UPDATED: 'model_updated',
  MODEL_DELETED: 'model_deleted',
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_TYPING: 'user_typing',
  SESSION_CREATED: 'session_created',
  SESSION_UPDATED: 'session_updated',
  SESSION_DELETED: 'session_deleted',
  CHAT_CREATED: 'chat_created',
  SOCKET_CONNECTED: 'socket_connected',
  INIT: 'init',
  HEARTBEAT: 'heartbeat',
  AUTHENTICATED: 'authenticated',
  LOGGED_OUT: 'logged_out',
  CLIENT_MESSAGE_MALFORMED: 'client_message_malformed',
  CLIENT_MESSAGE_INVALID: 'client_message_invalid',
  ERROR: 'error',
  INVALID_REAUTH_TOKEN: 'invalid_reauth_token',
} as const;
export type SERVER_MESSAGE_TYPE = typeof SERVER_MESSAGE_TYPE;
export type A_SERVER_MESSAGE_TYPE = SERVER_MESSAGE_TYPE[keyof SERVER_MESSAGE_TYPE];

export type ServerMessageType<T extends A_SERVER_MESSAGE_TYPE> = MessageType<T>;

export interface ServerModelChangedMessageType<T extends A_SERVER_MESSAGE_TYPE, M extends Model> extends ServerMessageType<T> {
  readonly model: M,
}
