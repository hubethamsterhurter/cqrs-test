import { Type } from 'class-transformer';
import { SERVER_MESSAGE_TYPE, ServerModelChangedMessageType } from "../modules/server-message-type";
import { Equals, ValidateNested, IsObject } from "class-validator";
import { ChatModel } from '../../domains/chat/chat.model';
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.CHAT_CREATED

export class ServerMessageChatCreated implements ServerModelChangedMessageType<SERVER_MESSAGE_TYPE['CHAT_CREATED'], ChatModel> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageChatCreated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

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
    trace: Trace,
    model: ChatModel
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.trace = props.trace;
      this.model = props.model;
    }
  }
}
