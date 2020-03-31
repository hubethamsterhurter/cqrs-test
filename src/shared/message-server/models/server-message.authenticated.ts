import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals } from "class-validator";
import { UserModel } from '../../domains/user/user.model';
import { Trace } from '../../helpers/Tracking.helper';
import { ReauthSessionTokenModel } from '../../domains/auth-token/reauth-session-token.model';

const _t = SERVER_MESSAGE_TYPE.AUTHENTICATED

export class ServerMessageAuthenticated implements ServerMessageType<SERVER_MESSAGE_TYPE['AUTHENTICATED']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageAuthenticated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly you!: UserModel;

  @IsObject()
  @ValidateNested()
  @Type(() => ReauthSessionTokenModel)
  readonly token!: ReauthSessionTokenModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    trace: Trace,
    you: UserModel
    token: ReauthSessionTokenModel,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.trace = props.trace;
      this.you = props.you;
      this.token = props.token;
    }
  }
}