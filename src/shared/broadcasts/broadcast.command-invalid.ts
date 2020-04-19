import { Type } from 'class-transformer';
import { ValidationError, IsArray, IsString } from "class-validator";
import { BaseMessage } from '../base/base.message';

export class CommandInvalidBroadcast extends BaseMessage {
  // do not bother validate nested
  @IsArray()
  @Type(() => ValidationError)
  readonly errors!: ValidationError[];

  @IsString()
  readonly MessageCtorName!: string;
}
