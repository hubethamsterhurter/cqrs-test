import { IsString } from "class-validator";
import { Trace } from "../helpers/Tracking.helper";
import { IMessage } from "../interfaces/interface.message";
import { ctorName } from "../helpers/ctor-name.helper";

export abstract class BaseMessage<D extends object = object> implements IMessage<D> {
  @IsString()
  readonly _n = ctorName(this);
  abstract trace: Trace
  abstract dto: D
}
