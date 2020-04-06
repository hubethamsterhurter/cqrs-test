// export const USER_FIELD: {[K in keyof UserModel]: K} = {
//   id: 'id',
//   user_name: 'user_name',
//   password: 'password',
//   updated_at: 'updated_at',
//   created_at: 'created_at',
//   deleted_at: 'deleted_at',
// } as const;
// export type USER_FIELD = typeof USER_FIELD;
// export type A_USER_FIELD = USER_FIELD[keyof USER_FIELD];

import { K2K } from "../../types/keys-to-keys.type";
import { AuthTokenModel } from "./auth-token.model";
import { BaseModel } from "../../base/base.model";

export const AUTH_TOKEN_DEFINITION = {
  //
} as const;
export type AUTH_TOKEN_DEFINITION = typeof AUTH_TOKEN_DEFINITION;

export const AUTH_TOKEN_FIELD: Omit<K2K<AuthTokenModel>, keyof BaseModel> = {
  expires_at: 'expires_at',
  session_id: 'session_id',
  user_id: 'user_id',
} as const
export type AUTH_TOKEN_FIELD = typeof AUTH_TOKEN_FIELD;
export type A_AUTH_TOKEN_FIELD = AUTH_TOKEN_FIELD[keyof AUTH_TOKEN_FIELD];

export const AUTH_TOKEN_FILLABLE_FIELDS: A_AUTH_TOKEN_FIELD[] = [
  //
];
