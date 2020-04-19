import { MinLength, MaxLength, IsString, IsIn, IsOptional } from "class-validator";
import { A_USER_COLOUR } from "../../constants/user-colour";
import { USER_DEFN } from "./user.definition";
import { BaseMessage } from "../../base/base.message";

export class CreateUserCommand extends BaseMessage {
  @MinLength(USER_DEFN.name.minLen)
  @MaxLength(USER_DEFN.name.maxLen)
  @IsString()
  readonly name!: string;

  @MinLength(USER_DEFN.password.minLen)
  @MaxLength(USER_DEFN.password.maxLen)
  @IsString()
  readonly password!: string;

  @IsOptional()
  @IsIn(USER_DEFN.colour.isIn)
  readonly colour?: A_USER_COLOUR;
}
