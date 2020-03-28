import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVET_TYPE, SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Model } from "../../../shared/domains/model";
import { ClassType } from "class-transformer/ClassTransformer";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload<M extends Model> {
  readonly model: M,
  readonly CTor: ClassType<M>
}
const _t = SERVER_EVENT_TYPE.MODEL_CREATED;

export class ServerEventModelCreated<M extends Model = Model> implements EventType<SERVER_EVET_TYPE['MODEL_CREATED'], Payload<M>> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerEventModelCreated._t;

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
