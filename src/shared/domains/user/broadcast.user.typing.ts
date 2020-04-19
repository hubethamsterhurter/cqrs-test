import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean } from "class-validator";
import { BaseMessage } from '../../base/base.message';

export class UserTypingBroadcast extends BaseMessage {
  @IsString()
  readonly user_id!: string;

  @IsBoolean()
  readonly typing!: boolean;

  @IsDate()
  @Type(() => Date)
  readonly timestamp!: Date;
}
