import { IsString, MaxLength, MinLength, IsOptional } from "class-validator";
import { CHAT_DEFINITION } from '../chat.definition';

export class UpdateChatDto {
  @IsString()
  readonly id!: string;

  @IsOptional()
  @MinLength(CHAT_DEFINITION.content.minLength)
  @MaxLength(CHAT_DEFINITION.content.maxLength)
  @IsString()
  readonly content?: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    id: string,
    content?: string,
    sent_at?: Date
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.id = props.id;
      this.content = props.content;
    }
  }
}
