import { Type } from 'class-transformer'
import { CHAT_DEFINITION } from './chat.definition';
import { IsOptional, IsString, MaxLength, MinLength, IsDate } from 'class-validator';
import { ID_DEFINITION } from '../id.definition';
import { ModelType } from '../model.type';

export class ChatModel implements ModelType {
  @MinLength(ID_DEFINITION.id.minLength)
  @MaxLength(ID_DEFINITION.id.maxLength)
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  author_id!: string | null;

  @MinLength(CHAT_DEFINITION.content.minLength)
  @MaxLength(CHAT_DEFINITION.content.maxLength)
  @IsString()
  content!: string;

  @IsDate() @Type(() => Date) sent_at!: Date;
  @IsDate() @Type(() => Date) updated_at!: Date;
  @IsDate() @Type(() => Date) created_at!: Date;
  @IsOptional() @IsDate() @Type(() => Date) deleted_at!: Date | null;

  constructor(props: {
    id: string;
    author_id: string | null;
    content: string;
    sent_at: Date;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date | null;
  }) {
    if (props) {
      this.id = props.id;
      this.author_id = props.author_id;
      this.content = props.content;
      this.sent_at = props.sent_at;
      this.updated_at = props.updated_at;
      this.created_at = props.created_at;
      this.deleted_at = props.deleted_at;
    }
  }
}