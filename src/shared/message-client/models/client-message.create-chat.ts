import { Type } from 'class-transformer';
import { CLIENT_MESSAGE_TYPE, ClientMessageType } from "../modules/client-message-type";
import { IsString, IsDate, MaxLength, MinLength, Equals, IsObject, ValidateNested } from "class-validator";
import { CHAT_DEFINITION } from "../../domains/chat/chat.definition";
import { Trace } from '../../helpers/Tracking.helper';

const _t = CLIENT_MESSAGE_TYPE.CHAT_CREATE;

export class ClientMessageCreateChat implements ClientMessageType<CLIENT_MESSAGE_TYPE['CHAT_CREATE']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ClientMessageCreateChat._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  @MinLength(CHAT_DEFINITION.content.minLength)
  @MaxLength(CHAT_DEFINITION.content.maxLength)
  @IsString()
  readonly content!: string;

  @Type(() => Date)
  @IsDate()
  readonly sent_at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    content: string,
    sent_at: Date
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.content = props.content;
      this.sent_at = props.sent_at;
    }
  }
}
