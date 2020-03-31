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

import { UserModel } from "./user.model";
import { BaseModel } from "../../base/base.model";
import { K2K } from "../../types/keys-to-keys.type";

export const USER_DEFINITION = {
  user_name: { minLength: 2, maxLength: 15 },
  password: { minLength: 4, maxLength: 20 },
} as const;
export type USER_DEFINITION = typeof USER_DEFINITION;

export const USER_FIELD: Omit<K2K<UserModel>, keyof BaseModel> = {
  colour: 'colour',
  password: 'password',
  user_name: 'user_name',
} as const
export type USER_FIELD = typeof USER_FIELD;
export type A_USER_FIELD = USER_FIELD[keyof USER_FIELD];

export const USER_FILLABLE_FIELDS: A_USER_FIELD[] = [
  USER_FIELD.colour,
  USER_FIELD.user_name,
  USER_FIELD.password,
];
export type USER_FILLABLE_FIELDS = typeof USER_FILLABLE_FIELDS;