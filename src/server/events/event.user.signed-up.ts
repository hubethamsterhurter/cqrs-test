import { UserModel } from "../domains/user/user.model";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";
import { SessionModel } from "../domains/session/session.model";

export class UserSignedUpEvent extends BaseEvent {
  @IsObject()
  @ValidateNested()
  @Type(() => SessionModel)
  readonly session!: SessionModel;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly user!: UserModel;
}
