import { UserModel } from "../../server/domains/user/user.model";
import { ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { ChatViewable } from "../domains/chat/chat.viewable";
import { SessionViewable } from "../domains/session/session.viewable";
import { UserViewable } from "../domains/user/user.viewable";
import { BaseMessage } from "../base/base.message";

export class InitBroadcast extends BaseMessage {
  @IsArray()
  @ValidateNested()
  @Type(() => UserModel)
  readonly users!: UserViewable[];

  @IsArray()
  @ValidateNested()
  @Type(() => ChatViewable)
  readonly chats!: ChatViewable[];

  @IsArray()
  @ValidateNested()
  @Type(() => SessionViewable)
  readonly sessions!: SessionViewable[];
}
