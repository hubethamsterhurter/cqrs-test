import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { IsObject, ValidateNested, Equals, IsNumber, IsString } from "class-validator";
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.ERROR;

export class ServerMessageError implements ServerMessageType<SERVER_MESSAGE_TYPE['ERROR']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageError._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  @IsNumber()
  readonly code!: number;

  @IsString()
  readonly message!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    message: string,
    code: number,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.message = props.message;
      this.code = props.code;
    }
  }
}
