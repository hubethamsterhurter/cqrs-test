import { Type } from 'class-transformer';
import { CLIENT_MESSAGE_TYPE, ClientMessageType } from "../modules/client-message-type";
import { VER } from "../../constants/ver";
import { IsString, IsDate, MaxLength, MinLength, Equals } from "class-validator";
import { CHAT_DEFINITION } from "../../domains/chat/chat.definition";

const _v = VER._0_1;
const _t = CLIENT_MESSAGE_TYPE.CHAT_CREATE;

export class ClientMessageCreateChat implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['CHAT_CREATE']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(_v) readonly _v = ClientMessageCreateChat._v;
  @Equals(_t) readonly _t = ClientMessageCreateChat._t;

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
  constructor(props: { content: string, sent_at: Date }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.content = props.content;
      this.sent_at = props.sent_at;
    }
  }
}
