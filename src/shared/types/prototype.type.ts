import { Constructor } from "./constructor.type";

export interface Prototype {
  constructor: Constructor<this>,
}
