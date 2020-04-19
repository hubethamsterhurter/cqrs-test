import { Type } from 'class-transformer';
import { IsDate } from "class-validator";
import { BaseMessage } from '../base/base.message';

export class ServerHeartbeatBroadcast extends BaseMessage {
  @IsDate()
  @Type(() => Date)
  readonly at!: Date;
}
