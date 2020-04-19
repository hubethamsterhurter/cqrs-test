import { MinLength, MaxLength, IsString } from "class-validator";
import { USER_DEFN } from "../user/user.definition";
import { BaseMessage } from "../../base/base.message";

export class LoginCommand extends BaseMessage {
  @MinLength(USER_DEFN.name.minLen)
  @MaxLength(USER_DEFN.name.maxLen)
  @IsString()
  readonly user_name!: string;

  @MinLength(USER_DEFN.password.minLen)
  @MaxLength(USER_DEFN.password.maxLen)
  @IsString()
  readonly password!: string;
}

