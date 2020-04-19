import { Has_t } from "./has-_t.type";

export type Without_t<T extends Has_t<any>> = Omit<T, '_t'>
