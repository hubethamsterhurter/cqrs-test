import { A_VER } from "../../constants/ver";

export const CLIENT_MESSAGE_TYPE = {
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  TYPING: 'typing',
  CHAT_CREATE: 'chat_create',
  SIGN_UP: 'sign_up',
  LOG_IN: 'log_in',
  LOG_OUT: 'log_out',
} as const;
export type CLIENT_MESSAGE_TYPE = typeof CLIENT_MESSAGE_TYPE;
export type A_CLIENT_MESSAGE_TYPE = CLIENT_MESSAGE_TYPE[keyof CLIENT_MESSAGE_TYPE];

export interface ClientMessageType<V extends A_VER = A_VER, T extends A_CLIENT_MESSAGE_TYPE = A_CLIENT_MESSAGE_TYPE> {
  readonly _v: V,
  readonly _t: T,
}
