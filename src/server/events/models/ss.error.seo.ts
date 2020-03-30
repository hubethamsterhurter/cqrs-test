import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload {
  readonly err: Error
};
const _t = SERVER_EVENT_TYPE.SOCKET_SERVER_ERROR

export class SSErrorSeo implements EventType<SERVER_EVENT_TYPE['SOCKET_SERVER_ERROR'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = SSErrorSeo._t;

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