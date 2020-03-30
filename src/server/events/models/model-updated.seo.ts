import { EventType } from "../../../shared/types/event.type";
import { SERVER_EVENT_TYPE } from "../modules/server-event-type";
import { Model } from "../../../shared/domains/model";
import { ClassType } from "class-transformer/ClassTransformer";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Type } from "class-transformer";

interface Payload<M> {
  readonly model: M,
  readonly CTor: ClassType<M>
}
const _t = SERVER_EVENT_TYPE.MODEL_UPDATED;

export class ModelUpdatedSeo<M extends Model = Model> implements EventType<SERVER_EVENT_TYPE['MODEL_UPDATED'], Payload<M>> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ModelUpdatedSeo._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  readonly _p!: Payload<M>;

  constructor(props: {
    _p: Payload<M>,
    trace: Trace,
  }) {
    if (props) {
      this.trace = props.trace;
      this._p = props._p;
    }
  }
}