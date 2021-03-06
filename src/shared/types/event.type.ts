import { Has_t } from "./has-_t.type";
import { Has_o } from "./has-_o.type";

export interface EventType<T extends string | number, P extends undefined | {}> extends Has_t<T>, Has_o {
  _p: P,
}