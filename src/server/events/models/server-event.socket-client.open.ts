import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { SocketClient } from "../../global/socket-client/socket-client";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload {
  readonly socket: SocketClient,
};
const _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_OPEN;

export class ServerEventSocketClientOpen implements EventType<SERVER_EVENT_TYPE['SOCKET_CLIENT_OPEN'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventSocketClientOpen._t;

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
