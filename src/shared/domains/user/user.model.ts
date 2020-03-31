import { USER_DEFINITION } from "./user.definition";
import { IsString, MinLength, MaxLength, IsIn } from 'class-validator';
import { USER_COLOURS, A_USER_COLOUR } from '../../constants/user-colour';
import { BaseModel } from '../../base/base.model';

export class UserModel extends BaseModel {
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

  /**
   * @constructor
   *
   * @param base
   * @param props
   */
  constructor(
    base: BaseModel,
    props: {
      user_name: string;
      password: string;
      colour: A_USER_COLOUR;
    }
  ) {
    super(base);
    if (props) {
      this.user_name = props.user_name;
      this.password = props.password;
      this.colour = props.colour;
    }
  }
}