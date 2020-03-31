import { IsString, MaxLength, MinLength, IsOptional, IsDate } from "class-validator";
import { CHAT_DEFINITION } from '../chat.definition';
import { CreateMo } from "../../../helpers/create-mo.helper";
import { BaseDto } from "../../../base/base.dto";
import { Type } from "class-transformer";

export class UpdateChatCmDto extends BaseDto {
  @IsString()
  readonly id!: string;

  @IsOptional()
  @MinLength(CHAT_DEFINITION.content.minLength)
  @MaxLength(CHAT_DEFINITION.content.maxLength)
  @IsString()
  readonly content?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sent_at?: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly id: string,
    readonly content?: string,
    readonly sent_at?: Date
  }) {
    super();
    if (props) {
      this.id = props.id;
      this.content = props.content;
      this.sent_at = props.sent_at;
    }
  }
}

export class UpdateChatCmo extends CreateMo(UpdateChatCmDto) {};
