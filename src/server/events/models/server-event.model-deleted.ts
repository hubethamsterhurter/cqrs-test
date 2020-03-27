import { VER } from "../../../shared/constants/ver";
import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Model } from "../../../shared/domains/model";
import { ClassType } from "class-transformer/ClassTransformer";

interface Payload<M> { model: M, CTor: ClassType<M> }

export class ServerEventModelDeleted<M extends Model = Model> implements EventType<VER['_0_1'], SERVER_EVET_TYPE['MODEL_DELETED'], Payload<M>> {
  static get _v() { return VER._0_1; }
  static get _t() { return SERVER_EVENT_TYPE.MODEL_DELETED; }

  readonly _v = ServerEventModelDeleted._v;
  readonly _t = ServerEventModelDeleted._t;

  constructor(readonly _p: Payload<M>) {}
}
