import { Trace } from "../helpers/Tracking.helper";
import { Has_n } from "../types/has-_n.type";

export interface IEvent<D extends object = object> extends Has_n {
  readonly trace: Trace;
  readonly dto: D;
}
