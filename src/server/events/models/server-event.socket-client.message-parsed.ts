import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { SocketClient } from "../../global/socket-client/socket-client";
import { ClientMessage } from "../../../shared/message-client/modules/client-message-registry";
import { ClassType } from "class-transformer/ClassTransformer";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload<M> {
  readonly socket: SocketClient,
  readonly message: M,
  readonly Ctor: ClassType<M>
};
const _t = SERVER_EVENT_TYPE.SOCKET_CLIENT_MESSAGE_PARSED;

export class ServerEventSocketClientMessageParsed<M extends ClientMessage = ClientMessage> implements EventType<SERVER_EVET_TYPE['SOCKET_CLIENT_MESSAGE_PARSED'], Payload<M>> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventSocketClientMessageParsed._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  readonly _p!: Payload<M>;

  constructor(props: {
    _p: Payload<M>,
    _o: Trace,
  }) {
    if (props) {
      this._o = props._o;
      this._p = props._p;
    }
  }
}