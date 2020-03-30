import { MinLength, MaxLength, IsString } from "class-validator";
import { USER_DEFINITION } from "../../user/user.definition";

export class LoginDto {
  @MinLength(USER_DEFINITION.user_name.minLength)
  @MaxLength(USER_DEFINITION.user_name.maxLength)
  @IsString()
  readonly user_name!: string;

  @MinLength(USER_DEFINITION.password.minLength)
  @MaxLength(USER_DEFINITION.password.maxLength)
  @IsString()
  readonly password!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    user_name: string,
    password: string,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.user_name = props.user_name;
      this.password = props.password;
    }
  }
}