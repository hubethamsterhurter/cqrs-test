import { UserModel } from "../domains/user/user.model";
import { ChatModel } from "../domains/chat/chat.model";
import { ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { SessionModel } from "../domains/session/session.model";
import { BaseDto } from "../base/base.dto";
import { CreateMo } from "../helpers/create-mo.helper";

class InitSmDto extends BaseDto {
  @IsArray()
  @ValidateNested()
  @Type(() => UserModel)
  readonly users!: UserModel[];

  @IsArray()
  @ValidateNested()
  @Type(() => ChatModel)
  readonly chats!: ChatModel[];

  @IsArray()
  @ValidateNested()
  @Type(() => SessionModel)
  readonly sessions!: SessionModel[];


  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    sessions: SessionModel[],
    users: UserModel[],
    chats: ChatModel[],
  }) {
    super();
    if (props) {
      this.sessions = props.sessions;
      this.users = props.users;
      this.chats = props.chats;
    }
  }
}

export class InitSmo extends CreateMo(InitSmDto) {}