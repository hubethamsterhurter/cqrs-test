import { ClassType } from "class-transformer/ClassTransformer";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "./Tracking.helper";
import { BaseEvent } from "../base/base.event";

export function CreateSe<T extends object>(DtoCtor: ClassType<T>) {
  abstract class EventCore<D extends T = T> extends BaseEvent<D> {
    @IsObject()
    @ValidateNested()
    @Type(() => Trace)
    readonly trace!: Trace;

    @IsObject()
    @ValidateNested()
    @Type(() => DtoCtor)
    readonly dto!: D;

    /**
     * @constructor
     *
     * @param props
     */
    constructor(props: {
      trace: Trace,
      dto: D,
    }) {
      super();
      // props will not be defined if we do not construct ourselves
      if (props) {
        this.trace = props.trace;
        this.dto = props.dto;
      }
    }
  }

  return EventCore;
}
