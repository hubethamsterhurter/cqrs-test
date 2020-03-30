import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";
import { AuthTokenModel } from "../../../shared/domains/auth-token/auth-token.model";

interface Payload {
  readonly session: SessionModel,
  readonly user: UserModel,
  readonly authToken: AuthTokenModel,
}
const _t = SERVER_EVENT_TYPE.USER_LOGGED_IN;

export class UserLoggedInSeo implements EventType<SERVER_EVENT_TYPE['USER_LOGGED_IN'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = UserLoggedInSeo._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  readonly _p!: Payload;

  constructor(props: {
    _p: Payload,
    trace: Trace,
  }) {
    if (props) {
      this.trace = props.trace;
      this._p = props._p;
    }
  }
}
