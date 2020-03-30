import { MinLength, MaxLength, IsString, IsIn, IsOptional } from "class-validator";
import { USER_DEFINITION } from "../user.definition";
import { USER_COLOURS, A_USER_COLOUR } from "../../../constants/user-colour";

export class UpdateUserCdto {
  @IsString()
  readonly id!: string;

  @IsOptional()
  @MinLength(USER_DEFINITION.user_name.minLength)
  @MaxLength(USER_DEFINITION.user_name.maxLength)
  @IsString()
  readonly user_name?: string;

  @IsOptional()
  @MinLength(USER_DEFINITION.password.minLength)
  @MaxLength(USER_DEFINITION.password.maxLength)
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsIn(USER_COLOURS)
  readonly colour?: A_USER_COLOUR;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    id: string,
    user_name?: string,
    password?: string,
    colour?: A_USER_COLOUR,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.id = props.id;
      this.user_name = props.user_name;
      this.password = props.password;
      this.colour = props.colour;
    }
  }
}