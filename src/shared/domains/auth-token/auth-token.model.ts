import { Type } from 'class-transformer'
import { IsString, IsDate, IsOptional, } from 'class-validator';
import { BaseModel } from '../../base/base.model';

export class AuthTokenModel extends BaseModel {
  @IsString()
  session_id!: string;

  @IsString()
  user_id!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expires_at!: Date | null;

  constructor(
    base: BaseModel,
    props: {
      user_id: string;
      session_id: string;
      expires_at: Date | null;
    }
  ) {
    super(base);
    if (props) {
      this.user_id = props.user_id;
      this.session_id = props.session_id;
      this.expires_at = props.expires_at;
    }
  }
}