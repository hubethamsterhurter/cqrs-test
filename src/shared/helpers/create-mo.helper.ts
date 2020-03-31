import { ClassType } from "class-transformer/ClassTransformer";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "./Tracking.helper";
import { BaseMessage } from "../base/base.message";

export function CreateMo<D extends object>(DtoCtor: ClassType<D>) {
  abstract class MessageCore extends BaseMessage {
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

  return MessageCore;
}
