import { Type } from 'class-transformer';
import { IsObject } from "class-validator";
import { BaseMessage } from '../base/base.message';

export class CommandMalformedBroadcast extends BaseMessage {
  // do not bother validate nested
  @IsObject()
  @Type(() => Error)
  readonly error!: Error;
}
