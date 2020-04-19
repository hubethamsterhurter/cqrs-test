import { IsObject, IsString } from "class-validator";
import { BaseEvent } from "../base/base.event";
import { BaseModel } from "../base/base.model";

export class ModelCreatedEvent<D extends BaseModel = BaseModel> extends BaseEvent {
  @IsObject()
  readonly model!: D;

  @IsString()
  readonly CtorName!: string;
}
