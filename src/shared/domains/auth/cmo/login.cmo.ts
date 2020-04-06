import { MinLength, MaxLength, IsString } from "class-validator";
import { USER_DEFINITION } from "../../user/user.definition";
import { CreateMo } from "../../../helpers/create-mo.helper";
import { BaseDto } from "../../../base/base.dto";

export class LoginCmDto extends BaseDto {
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
    readonly user_name: string,
    readonly password: string,
  }) {
    super();
    if (props) {
      this.user_name = props.user_name;
      this.password = props.password;
    }
  }
}

export class loginCmo extends CreateMo(LoginCmDto) {};
