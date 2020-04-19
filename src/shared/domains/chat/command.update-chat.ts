import { IsString, MaxLength, MinLength, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { CHAT_DEFN } from "./chat.definition";
import { BaseMessage } from "../../base/base.message";

export class UpdateChatCommand extends BaseMessage {
  @IsString()
  readonly id!: string;

  @IsOptional()
  @MinLength(CHAT_DEFN.content.minLen)
  @MaxLength(CHAT_DEFN.content.maxLen)
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly sent_at?: Date;
}
