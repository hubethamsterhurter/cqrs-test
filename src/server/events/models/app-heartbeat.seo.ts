import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload {
  readonly at: Date;
}
const _t = SERVER_EVENT_TYPE.HEARTBEAT

export class AppHeartbeatSeo implements EventType<SERVER_EVENT_TYPE['HEARTBEAT'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = AppHeartbeatSeo._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  readonly _p!: Payload;

  constructor(props: {
    _p: Payload,
    _o: Trace,
  }) {
    if (props) {
      this.trace = props._o;
      this._p = props._p;
    }
  }
}
