import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Equals, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "../../../shared/helpers/Tracking.helper";

type Payload = undefined
const _t = SERVER_EVENT_TYPE.SOCKET_SERVER_LISTENING;

export class SSListeningSeo implements EventType<SERVER_EVENT_TYPE['SOCKET_SERVER_LISTENING'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = SSListeningSeo._t;

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