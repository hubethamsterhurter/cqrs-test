import { Type } from 'class-transformer'
import { USER_DEFINITION } from "./user.definition";
import { IsString, IsDate, MinLength, MaxLength, IsOptional, IsIn } from 'class-validator';
import { ID_DEFINITION } from '../id.definition';
import { ModelType } from '../model.type';
import { USER_COLOURS, A_USER_COLOUR } from '../../constants/user-colour';

export class UserModel implements ModelType {
  @MinLength(ID_DEFINITION.id.minLength)
  @MaxLength(ID_DEFINITION.id.maxLength)
  @IsString()
  id!: string;

  @MinLength(USER_DEFINITION.user_name.minLength)
  @MaxLength(USER_DEFINITION.user_name.maxLength)
  @IsString()
  user_name!: string;

  @MinLength(USER_DEFINITION.password.minLength)
  @MaxLength(USER_DEFINITION.password.maxLength)
  @IsString()
  password!: string;

  @IsIn(USER_COLOURS)
  colour!: A_USER_COLOUR;

  @IsDate() @Type(() => Date) updated_at!: Date;
  @IsDate() @Type(() => Date) created_at!: Date;
  @IsOptional() @IsDate() @Type(() => Date) deleted_at!: Date | null;

  constructor(props: {
    id: string,
    user_name: string;
    password: string;
    colour: A_USER_COLOUR;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date | null;
  }) {
    if (props) {
      this.id = props.id;
      this.user_name = props.user_name;
      this.password = props.password;
      this.colour = props.colour;
      this.updated_at = props.updated_at;
      this.created_at = props.created_at;
      this.deleted_at = props.deleted_at;
    }
  }
}