import { IsObject, ValidateNested } from "class-validator";
import { AuthTokenModel } from "../../../server/domains/auth-token/auth-token.model";
import { UserModel } from "../../../server/domains/user/user.model";
import { Type } from "class-transformer";
import { BaseMessage } from "../../base/base.message";

export class AuthenticatedBroadcast extends BaseMessage {
  @IsObject()
  @ValidateNested()
  @Type(() => AuthTokenModel)
  readonly token!: AuthTokenModel;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly you!: UserModel;
}
