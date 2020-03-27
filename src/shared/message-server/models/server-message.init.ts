import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { VER } from "../../constants/ver";
import { UserModel } from "../../domains/user/user.model";
import { ChatModel } from "../../domains/chat/chat.model";
import { ValidateNested, IsArray, Equals } from "class-validator";
import { Type } from "class-transformer";

const _v = VER._0_1
const _t = SERVER_MESSAGE_TYPE.INIT;

export class ServerMessageInit implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['INIT']> {
  static get _v() { return VER._0_1; }
  static get _t() { return SERVER_MESSAGE_TYPE.INIT; }

  @Equals(_v) readonly _v = ServerMessageInit._v;
  @Equals(_t) readonly _t = ServerMessageInit._t;

  @IsArray()
  @ValidateNested()
  @Type(() => UserModel)
  users!: UserModel[];

  @IsArray()
  @ValidateNested()
  @Type(() => ChatModel)
  chats!: ChatModel[];


  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    users: UserModel[],
    chats: ChatModel[],
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.users = props.users;
      this.chats = props.chats;
    }
  }
}