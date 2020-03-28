import ws from 'ws';
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { SocketClient } from "../../global/socket-client/socket-client";
import { Equals, IsObject, ValidateNested } from 'class-validator';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { Type } from 'class-transformer';

interface Payload {
  readonly client: SocketClient,
  readonly data: ws.Data,
};
const _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_MESSAGE;

export class ServerEventSocketClientMessage implements EventType<SERVER_EVET_TYPE['SOCKET_CLIENT_MESSAGE'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventSocketClientMessage._t;

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