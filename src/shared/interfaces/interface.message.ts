import { Trace } from "../helpers/Tracking.helper";

export interface IMessage<D extends object = object> {
  readonly _n: string;
  readonly trace: Trace;
  readonly dto: D;
}