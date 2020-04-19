import { Has_n } from "./has-_n.type";

// n for name (constructor name)
export type Without_n<T extends Has_n> = Omit<T, '_n'>
