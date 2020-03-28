import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { IncomingMessage } from "http";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload {
  readonly req: IncomingMessage,
  readonly headers: string[],
}
const _t = SERVER_EVENT_TYPE.SOCKET_SERVER_HEADERS;

export class ServerEventSocketServerHeaders implements EventType<SERVER_EVET_TYPE['SOCKET_SERVER_HEADERS'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventSocketServerHeaders._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  readonly _p!: Payload;

  constructor(props: {
    _p: Payload,
    _o: Trace,
  }) {
    if (props) {
      this._o = props._o;
      this._p = props._p;
    }
  }
}