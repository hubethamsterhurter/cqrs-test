import { Type } from 'class-transformer';
import { IsString, IsDate, MaxLength, MinLength } from "class-validator";
import { CHAT_DEFINITION } from '../chat.definition';
import { CreateMo } from '../../../helpers/create-mo.helper';
import { BaseDto } from '../../../base/base.dto';

export class CreateChatCmDto extends BaseDto {
  @MinLength(CHAT_DEFINITION.content.minLength)
  @MaxLength(CHAT_DEFINITION.content.maxLength)
  @IsString()
  readonly content!: string;

  @Type(() => Date)
  @IsDate()
  readonly sent_at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    content: string,
    sent_at: Date
  }) {
    super();
    if (props) {
      this.content = props.content;
      this.sent_at = props.sent_at;
    }
  }
}

export class CreateChatCmo extends CreateMo(CreateChatCmDto) {};