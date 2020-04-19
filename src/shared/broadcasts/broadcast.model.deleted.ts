import { IsString, IsObject } from "class-validator";
import { BaseViewable } from "../base/base.dto";
import { BaseMessage } from "../base/base.message";

export class ModelDeletedBroadcast<M extends BaseViewable = BaseViewable> extends BaseMessage {
  @IsString()
  ctorName!: string

  @IsObject()
  model!: M;
}
