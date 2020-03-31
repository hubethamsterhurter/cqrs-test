import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { IsObject, ValidateNested, Equals, IsNumber, IsString, IsOptional } from "class-validator";
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.INVALID_REAUTH_TOKEN;

export class ServerMessageInvalidReauthToken implements ServerMessageType<SERVER_MESSAGE_TYPE['INVALID_REAUTH_TOKEN']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageInvalidReauthToken._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  @IsString()
  readonly message!: string;

  @IsString()
  readonly invalidTokenId!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    trace: Trace,
    message: string,
    invalidTokenId: string,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.trace = props.trace;
      this.message = props.message;
      this.invalidTokenId = props.invalidTokenId;
    }
  }
}
