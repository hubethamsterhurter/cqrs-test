import { IsObject, IsString } from "class-validator";
import { BaseModel } from "../base/base.model";
import { BaseEvent } from "../base/base.event";

export class ModelUpdatedEvent<D extends BaseModel = BaseModel> extends BaseEvent {
  @IsObject()
  readonly model!: D;

  @IsString()
  readonly ctorName!: string;
}
