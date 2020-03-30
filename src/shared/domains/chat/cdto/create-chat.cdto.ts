import { Type } from 'class-transformer';
import { IsString, IsDate, MaxLength, MinLength } from "class-validator";
import { CHAT_DEFINITION } from '../chat.definition';

export class CreateChatCdto {
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
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.content = props.content;
      this.sent_at = props.sent_at;
    }
  }
}
