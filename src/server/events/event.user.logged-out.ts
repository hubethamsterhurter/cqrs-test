import { UserModel } from "../domains/user/user.model";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SocketClient } from "../web-sockets/socket-client/socket-client";
import { BaseEvent } from "../base/base.event";

export class UserLoggedOutEvent extends BaseEvent {
  @IsObject()
  readonly socket!: SocketClient;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly formerUser!: UserModel;
}
