import { K2K } from "../../types/keys-to-keys.type";
import { SessionModel } from "./session.model";
import { BaseModel } from "../../base/base.model";

// ? not required
export const CONNECTED_CLIENT_DEFINITION = {
} as const;
export type CONNECTED_CLIENT_DEFINITION = typeof CONNECTED_CLIENT_DEFINITION;

export const SESSION_FIELD: Omit<K2K<SessionModel>, keyof BaseModel> = {
  connected_at: 'connected_at',
  disconnected_at: 'disconnected_at', 
  socket_id: 'socket_id',
  user_id: 'user_id',
} as const
export type SESSION_FIELD = typeof SESSION_FIELD;
export type A_SESSION_FIELD = SESSION_FIELD[keyof SESSION_FIELD];

export const SESSION_FILLABLE_FIELDS: A_SESSION_FIELD[] = [
  //
];
