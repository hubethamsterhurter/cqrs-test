import ws from 'ws';
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { IncomingMessage } from "http";
import { Equals, IsObject, ValidateNested } from 'class-validator';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { Type } from 'class-transformer';

interface Payload {
  readonly req: IncomingMessage,
  readonly rawWebSocket: ws,
}
const _t = SERVER_EVENT_TYPE.SOCKET_SERVER_CONNECTION;

export class ServerEventSocketServerConnection implements EventType<SERVER_EVET_TYPE['SOCKET_SERVER_CONNECTION'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventSocketServerConnection._t;

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