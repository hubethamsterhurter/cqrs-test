import { IsString } from "class-validator";
import { IEvent } from "../interfaces/interface.event";
import { Trace } from "../helpers/Tracking.helper";
import { ctorName } from "../helpers/ctor-name.helper";

export abstract class BaseEvent<D extends object = object> implements IEvent<D> {
  @IsString()
  readonly _n = ctorName(this);
  abstract trace: Trace;
  abstract dto: D;
}