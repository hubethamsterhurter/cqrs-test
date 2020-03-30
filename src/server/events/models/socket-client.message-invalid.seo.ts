import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { SocketClient } from "../../global/socket-client/socket-client";
import { ValidationError, Equals, ValidateNested, IsObject } from "class-validator";
import { ClientMessageCtor } from "../../../shared/message-client/modules/client-message-registry";
import { Type } from "class-transformer";
import { Trace } from "../../../shared/helpers/Tracking.helper";

interface Payload {
  readonly socket: SocketClient,
  readonly errs: ValidationError[],
  readonly Ctor: ClientMessageCtor
};
const _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_MESSAGE_INVALID;

export class SocketClientMessageInvalidSeo implements EventType<SERVER_EVENT_TYPE['SOCKET_CLIENT_MESSAGE_INVALID'], Payload> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = SocketClientMessageInvalidSeo._t;

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
