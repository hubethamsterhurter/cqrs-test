import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { Equals, IsObject, ValidateNested, IsString } from "class-validator";
import { Trace } from "../../helpers/Tracking.helper";
import { Type } from "class-transformer";

const _t = SERVER_MESSAGE_TYPE.LOGGED_OUT

export class ServerMessageLoggedOut implements ServerMessageType<SERVER_MESSAGE_TYPE['LOGGED_OUT']> {
  static get _t() { return _t; }
  @Equals( _t) readonly _t = ServerMessageLoggedOut._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  @IsString()
  readonly deletedReauthTokenId!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    deletedReauthTokenId: string,
    trace: Trace,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.deletedReauthTokenId = props.deletedReauthTokenId;
      this.trace = props.trace;
    }
  }
}