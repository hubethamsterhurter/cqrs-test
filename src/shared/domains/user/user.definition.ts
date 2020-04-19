import { USER_COLOURS } from "../../constants/user-colour";
import { EntityOptions } from "typeorm";

const userTableDefn: EntityOptions = {
  name: 'users',
  orderBy: { 'created_at': 'DESC', },
}

export const USER_DEFN = {
  __table__: userTableDefn,
  name: {
    maxLen: 50,
    minLen: 3,
  },
  password: {
    maxLen: 30,
    minLen: 4,
  },
  colour: {
    isIn: USER_COLOURS,
  }
} as const;
