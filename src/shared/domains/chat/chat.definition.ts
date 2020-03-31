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

import { K2K } from "../../types/keys-to-keys.type";
import { ChatModel } from "./chat.model";
import { BaseModel } from "../../base/base.model";

export const CHAT_DEFINITION = {
  content: { minLength: 1, maxLength: 50 },
} as const;
export type CHAT_DEFINITION = typeof CHAT_DEFINITION;

export const CHAT_FIELD: Omit<K2K<ChatModel>, keyof BaseModel> = {
  content: 'content',
  author_id: 'author_id',
  sent_at: 'sent_at',
}
export type CHAT_FIELD = typeof CHAT_FIELD;
export type A_CHAT_FIELD = CHAT_FIELD[keyof CHAT_FIELD];

export const CHAT_FILLABLE_FIELDS: A_CHAT_FIELD[] = [
  CHAT_FIELD.content,
];
