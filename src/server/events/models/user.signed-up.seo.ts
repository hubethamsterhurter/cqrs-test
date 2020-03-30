import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload {
  readonly session: SessionModel,
  readonly user: UserModel
}
const _t = SERVER_EVENT_TYPE.USER_SIGNED_UP;

export class UserSignedUpSeo implements EventType<SERVER_EVENT_TYPE['USER_SIGNED_UP'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = UserSignedUpSeo._t;

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
