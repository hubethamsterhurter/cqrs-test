import { BaseViewable } from '../base/base.dto';
import { IsString, IsObject } from 'class-validator';
import { BaseMessage } from '../base/base.message';

export class ModelUpdatedBroadcast<M extends BaseViewable = BaseViewable> extends BaseMessage {
  @IsString()
  ctorName!: string

  @IsObject()
  model!: M;
}
