import { MinLength, IsString, MaxLength, IsOptional, IsIn } from "class-validator";
import { USER_DEFINITION } from "../../user/user.definition";
import { USER_COLOURS, A_USER_COLOUR } from "../../../constants/user-colour";

export class SignupDto {
  @MinLength(USER_DEFINITION.user_name.minLength)
  @MaxLength(USER_DEFINITION.user_name.maxLength)
  @IsString()
  readonly user_name!: string;

  @MinLength(USER_DEFINITION.password.minLength)
  @MaxLength(USER_DEFINITION.password.maxLength)
  @IsString()
  readonly password!: string;

  @IsOptional()
  @IsIn(USER_COLOURS)
  readonly colour?: A_USER_COLOUR;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    user_name: string,
    password: string,
    colour?: A_USER_COLOUR,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.user_name = props.user_name;
      this.password = props.password;
      this.colour = props.colour;
    }
  }
}