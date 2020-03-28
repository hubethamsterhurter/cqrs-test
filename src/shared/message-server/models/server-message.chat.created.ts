import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { Equals, ValidateNested, IsObject } from "class-validator";
import { ChatModel } from '../../domains/chat/chat.model';
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.CHAT_CREATED

export class ServerMessageChatCreated implements ServerMessageType<SERVER_MESSAGE_TYPE['CHAT_CREATED']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageChatCreated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  @IsObject()
  @ValidateNested()
  @Type(() => ChatModel)
  readonly model!: ChatModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    model: ChatModel
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.model = props.model;
    }
  }
}
