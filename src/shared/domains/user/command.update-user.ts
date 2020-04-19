import { MinLength, MaxLength, IsString, IsIn, IsOptional } from "class-validator";
import { USER_COLOURS, A_USER_COLOUR } from "../../constants/user-colour";
import { USER_DEFN } from "./user.definition";
import { BaseMessage } from "../../base/base.message";

export class UpdateUserCommand extends BaseMessage {
  @IsString()
  readonly id!: string;

  @IsOptional()
  @MinLength(USER_DEFN.name.minLen)
  @MaxLength(USER_DEFN.name.maxLen)
  @IsString()
  readonly name?: string;

  @IsOptional()
  @MinLength(USER_DEFN.password.minLen)
  @MaxLength(USER_DEFN.password.maxLen)
  @IsString()
  readonly password?: string;

  @IsOptional()
  @IsIn(USER_COLOURS)
  readonly colour?: A_USER_COLOUR;
}
