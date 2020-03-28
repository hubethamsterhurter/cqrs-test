import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { UserModel } from "../../domains/user/user.model";
import { ChatModel } from "../../domains/chat/chat.model";
import { ValidateNested, IsArray, Equals, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { SessionModel } from "../../domains/session/session.model";
import { Trace } from "../../helpers/Tracking.helper";

const _t = SERVER_MESSAGE_TYPE.INIT;

export class ServerMessageInit implements ServerMessageType<SERVER_MESSAGE_TYPE['INIT']> {
  static get _t() { return SERVER_MESSAGE_TYPE.INIT; }
  @Equals(_t) readonly _t = ServerMessageInit._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

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
  readonly clients!: SessionModel[];


  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    clients: SessionModel[],
    users: UserModel[],
    chats: ChatModel[],
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.clients = props.clients;
      this.users = props.users;
      this.chats = props.chats;
    }
  }
}