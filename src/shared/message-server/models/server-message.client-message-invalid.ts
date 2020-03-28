import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { IsObject, ValidateNested, ValidationError, IsArray, Equals, IsString } from "class-validator";
import { Trace } from '../../helpers/Tracking.helper';
import { A_CLIENT_MESSAGE_TYPE } from '../../message-client/modules/client-message-type';

const _t = SERVER_MESSAGE_TYPE.CLIENT_MESSAGE_INVALID;

export class ServerMessageClientMessageInvalid implements ServerMessageType<SERVER_MESSAGE_TYPE['CLIENT_MESSAGE_INVALID']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageClientMessageInvalid._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  // do not bother validate nested
  @IsArray()
  @Type(() => ValidationError)
  readonly errors!: ValidationError[];

  @IsString()
  readonly messageType!: A_CLIENT_MESSAGE_TYPE;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    errors: ValidationError[],
    messageType: A_CLIENT_MESSAGE_TYPE,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.errors = props.errors;
      this.messageType = props.messageType;
    }
  }
}
