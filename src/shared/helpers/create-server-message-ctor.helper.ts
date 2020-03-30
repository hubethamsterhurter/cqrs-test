import { ClassType } from "class-transformer/ClassTransformer";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "./Tracking.helper";
import { ServerMessageType, A_SERVER_MESSAGE_TYPE } from "../message-server/modules/server-message-type";

export function CreateServerMessageCtor<T extends A_SERVER_MESSAGE_TYPE, D extends {}>(_t: T, SdtoCtor: ClassType<D>) {
  class BaseServerMessage implements ServerMessageType<T> {
    static get _t() { return _t; }
    @Equals(_t) readonly _t = _t;

    @IsObject()
    @ValidateNested()
    @Type(() => Trace)
    readonly trace!: Trace;

    @IsObject()
    @ValidateNested()
    @Type(() => SdtoCtor)
    readonly sdto!: D;

    /**
     * @constructor
     *
     * @param props
     */
    constructor(props: {
      trace: Trace,
      sdto: D,
      user_name: string,
      password: string,
    }) {
      // props will not be defined if we do not construct ourselves
      if (props) {
        this.trace = props.trace;
        this.sdto = props.sdto;
      }
    }
  }

  return BaseServerMessage;
}
