import { Type } from 'class-transformer'
import { IsString, IsDate, IsOptional, } from 'class-validator';
import { ModelType } from '../model.type';

export class ReauthSessionTokenModel implements ModelType {
  @IsString()
  id!: string;

  @IsString()
  session_id!: string;

  @IsString()
  user_id!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expires_at!: Date | null;

  @IsDate() @Type(() => Date) updated_at!: Date;
  @IsDate() @Type(() => Date) created_at!: Date;
  @IsOptional() @IsDate() @Type(() => Date) deleted_at!: Date | null;

  constructor(props: {
    id: string,
    user_id: string;
    origin_session_id: string;
    expires_at: Date | null;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date | null;
  }) {
    if (props) {
      this.id = props.id;
      this.user_id = props.user_id;
      this.session_id = props.origin_session_id;
      this.updated_at = props.updated_at;
      this.created_at = props.created_at;
      this.deleted_at = props.deleted_at;
    }
  }
}