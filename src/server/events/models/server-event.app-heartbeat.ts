import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { VER } from "../../../shared/constants/ver";

export class ServerEventAppHeartbeat implements EventType<VER['_0_1'], SERVER_EVET_TYPE['HEARTBEAT'], { at: Date }> {
  readonly _v = VER._0_1;
  readonly _t = SERVER_EVENT_TYPE.HEARTBEAT;
  constructor(readonly _p: { at: Date }) {}
}
