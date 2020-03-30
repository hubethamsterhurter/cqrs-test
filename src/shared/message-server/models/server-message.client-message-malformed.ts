import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { IsObject, ValidateNested, Equals } from "class-validator";
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.CLIENT_MESSAGE_MALFORMED;

export class ServerMessageClientMessageMalformed implements ServerMessageType<SERVER_MESSAGE_TYPE['CLIENT_MESSAGE_MALFORMED']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageClientMessageMalformed._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  // do not bother validate nested
  @IsObject()
  @Type(() => Error)
  readonly error!: Error;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    trace: Trace,
    error: Error,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.trace = props.trace;
      this.error = props.error;
    }
  }
}
