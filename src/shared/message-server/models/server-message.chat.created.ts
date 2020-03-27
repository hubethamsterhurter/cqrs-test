import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { VER } from "../../constants/ver";
import { Equals, ValidateNested, IsObject } from "class-validator";
import { ChatModel } from '../../domains/chat/chat.model';

const _v = VER._0_1;
const _t = SERVER_MESSAGE_TYPE.CHAT_CREATED

export class ServerMessageChatCreated implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['CHAT_CREATED']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(_v) readonly _v = ServerMessageChatCreated._v;
  @Equals(_t) readonly _t = ServerMessageChatCreated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => ChatModel)
  model!: ChatModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { model: ChatModel }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.model = props.model;
    }
  }
}
