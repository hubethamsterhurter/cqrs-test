import { IsString, IsObject } from "class-validator";
import { BaseViewable } from "../base/base.dto";
import { BaseMessage } from "../base/base.message";

export class ModelCreatedBroadcast<M extends BaseViewable = BaseViewable> extends BaseMessage {
  @IsString()
  CtorName!: string

  @IsObject()
  model!: M;
}
