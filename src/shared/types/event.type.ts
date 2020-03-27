import { A_VER } from "../constants/ver";

export interface EventType<V extends A_VER, T extends string | number, P extends undefined | {}> {
  _v: V,
  _t: T,
  _p: P,
}