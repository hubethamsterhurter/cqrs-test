import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { IsString, IsDate, IsBoolean, Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.USER_TYPING;

export class ServerMessageUserTyping implements ServerMessageType<SERVER_MESSAGE_TYPE['USER_TYPING']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageUserTyping._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  @IsString()
  readonly user_name!: string;

  @IsBoolean()
  readonly typing!: boolean;

  @IsDate()
  @Type(() => Date)
  readonly timestamp!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    trace: Trace,
    user_name: string,
    typing: boolean,
    timestamp: Date,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.trace = props.trace;
      this.user_name = props.user_name;
      this.typing = props.typing;
      this.timestamp = props.timestamp;
    }
  }
}
