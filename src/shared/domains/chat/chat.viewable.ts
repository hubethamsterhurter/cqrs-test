import { Type } from 'class-transformer'
import { BaseViewable } from '../../base/base.dto';
import { IsString, IsOptional } from 'class-validator';

export class ChatViewable extends BaseViewable {
  @IsOptional()
  @IsString()
  readonly author_id!: string | null;

  @IsString()
  readonly content!: string;

  @Type(() => Date)
  readonly sent_at!: Date;
}