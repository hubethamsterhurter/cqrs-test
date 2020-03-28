import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../helpers/Tracking.helper";
import { Type } from "class-transformer";

const _t = CLIENT_MESSAGE_TYPE.TYPING;

export class ClientMessageUserTyping implements ClientMessageType<CLIENT_MESSAGE_TYPE['TYPING']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ClientMessageUserTyping._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;


  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
    }
  }

}
