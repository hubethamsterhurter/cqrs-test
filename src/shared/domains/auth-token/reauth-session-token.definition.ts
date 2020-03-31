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

export const AUTH_TOKEN_DEFINITION = {
  //
} as const;
export type AUTH_TOKEN_DEFINITION = typeof AUTH_TOKEN_DEFINITION;
