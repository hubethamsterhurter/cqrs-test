import { Type } from 'class-transformer';
import { IsString, IsDate, MaxLength, MinLength } from "class-validator";
import { CHAT_DEFN } from './chat.definition';
import { BaseMessage } from '../../base/base.message';

export class CreateChatCommand extends BaseMessage {
  @MinLength(CHAT_DEFN.content.minLen)
  @MaxLength(CHAT_DEFN.content.maxLen)
  @IsString()
  readonly content!: string;

  @Type(() => Date)
  @IsDate()
  readonly sent_at!: Date;
}
