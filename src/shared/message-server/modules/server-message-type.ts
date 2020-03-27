import { A_VER } from "../../constants/ver";

export const SERVER_MESSAGE_TYPE = {
  MODEL_CREATED: 'model_created',
  MODEL_UPDATED: 'model_updated',
  MODEL_DELETED: 'model_deleted',
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_TYPING: 'user_typing',
  CLIENT_CREATED: 'client_created',
  CLIENT_UPDATED: 'client_updated',
  CLIENT_DELETED: 'client_deleted',
  CHAT_CREATED: 'chat_created',
  SOCKET_CONNECTED: 'socket_connected',
  INIT: 'init',
  HEARTBEAT: 'heartbeat',
  AUTHENTICATED: 'authenticated',
  LOGGED_OUT: 'logged_out',
} as const;
export type SERVER_MESSAGE_TYPE = typeof SERVER_MESSAGE_TYPE;
export type A_SERVER_MESSAGE_TYPE = SERVER_MESSAGE_TYPE[keyof SERVER_MESSAGE_TYPE];

export interface ServerMessageType<V extends A_VER = A_VER, T extends A_SERVER_MESSAGE_TYPE = A_SERVER_MESSAGE_TYPE> {
  readonly _v: V,
  readonly _t: T,
}
