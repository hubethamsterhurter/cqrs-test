import { MinLength, MaxLength, IsString, IsIn, IsOptional } from "class-validator";
import { USER_DEFINITION } from "../user.definition";
import { USER_COLOURS, A_USER_COLOUR } from "../../../constants/user-colour";
import { BaseDto } from "../../../base/base.dto";
import { CreateMo } from "../../../helpers/create-mo.helper";

export class CreateUserCmDto extends BaseDto {
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
    readonly user_name: string,
    readonly password: string,
    readonly colour?: A_USER_COLOUR,
  }) {
    super();
    if (props) {
      this.user_name = props.user_name;
      this.password = props.password;
      this.colour = props.colour;
    }
  }
}

export class CreateUserCmo extends CreateMo(CreateUserCmDto) {}