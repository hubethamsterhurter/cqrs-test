import { ClientMessageType, A_CLIENT_MESSAGE_TYPE } from "../message-client/modules/client-message-type";
import { ClassType } from "class-transformer/ClassTransformer";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "./Tracking.helper";

export function CreateCmoCtor<T extends A_CLIENT_MESSAGE_TYPE, D extends {}>(_t: T, DtoCtor: ClassType<D>) {
  class BaseClientMessage implements ClientMessageType<T> {
    static get _t() { return _t; }
    @Equals(_t) readonly _t = _t;

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
      // props will not be defined if we do not construct ourselves
      if (props) {
        this.trace = props.trace;
        this.dto = props.dto;
      }
    }
  }

  return BaseClientMessage;
}