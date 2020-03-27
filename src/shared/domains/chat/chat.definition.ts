// export const CHAT_FIELD = {
//   id: 'id',
//   content: 'content',
//   author_id: 'author_id',
//   sent_at: 'sent_at',
//   updated_at: 'updated_at',
//   created_at: 'created_at',
//   deleted_at: 'deleted_at',
// } as const;
// export type CHAT_FIELD = typeof CHAT_FIELD;
// export type A_CHAT_FIELD = CHAT_FIELD[keyof CHAT_FIELD];

export const CHAT_DEFINITION = {
  content: { minLength: 1, maxLength: 50 },
} as const;
export type CHAT_DEFINITION = typeof CHAT_DEFINITION;