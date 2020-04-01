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

export const CHAT_FILLABLE_FIELDS = [
  CHAT_FIELD.content,
] as const;
export type CHAT_FILLABLE_FIELDS = typeof CHAT_FILLABLE_FIELDS;

