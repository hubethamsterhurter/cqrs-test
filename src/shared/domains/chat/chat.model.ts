import { Type } from 'class-transformer'
import { CHAT_DEFINITION } from './chat.definition';
import { IsOptional, IsString, MaxLength, MinLength, IsDate } from 'class-validator';
import { BaseModel } from '../../base/base.model';

export class ChatModel extends BaseModel {
  @IsOptional()
  @IsString()
  author_id!: string | null;

  @MinLength(CHAT_DEFINITION.content.minLength)
  @MaxLength(CHAT_DEFINITION.content.maxLength)
  @IsString()
  content!: string;

  @IsDate() @Type(() => Date) sent_at!: Date;

  /**
   * @constructor
   *
   * @param props 
   */
  constructor(
    base: BaseModel,
    props: {
      id: string;
      author_id: string | null;
      content: string;
      sent_at: Date;
      updated_at: Date;
      created_at: Date;
      deleted_at: Date | null;
    }
  ) {
    super(base);
    if (props) {
      this.author_id = props.author_id;
      this.content = props.content;
      this.sent_at = props.sent_at;
    }
  }
}