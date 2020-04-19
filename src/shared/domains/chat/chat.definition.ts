import { EntityOptions } from "typeorm";

const chatTableDefn: EntityOptions = {
  name: 'users',
  orderBy: { 'created_at': 'DESC', },
}

export const CHAT_DEFN = {
  __table__: chatTableDefn,
  content: {
    maxLen: 200,
    minLen: 1,
  },
} as const;
