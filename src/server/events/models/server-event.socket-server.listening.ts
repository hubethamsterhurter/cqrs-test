import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Equals, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "../../../shared/helpers/Tracking.helper";

type Payload = undefined
const _t = SERVER_EVENT_TYPE.SOCKET_SERVER_LISTENING;

export class ServerEventSocketServerListening implements EventType<SERVER_EVET_TYPE['SOCKET_SERVER_LISTENING'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventSocketServerListening._t;

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