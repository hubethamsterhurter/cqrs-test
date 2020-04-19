export {};
// import { IsObject, ValidateNested, IsString } from "class-validator";
// import { Type } from "class-transformer";
// import { Trace } from "../helpers/Tracking.helper";
// import { ctorName } from "../helpers/ctor-name.helper";
// import { CtorOf } from "../helpers/ctor-of";
// import { $DANGER } from "../types/danger.type";

// export class MessageResource<D extends object = object> extends BaseEvent<D> {b
//   @IsObject()
//   @ValidateNested()
//   @Type(() => Trace)
//   readonly trace!: Trace;

//   @IsObject()
//   readonly dto!: D;

//   /**
//    * @constructor
//    *
//    * @param props
//    */
//   constructor(props: {
//     trace: Trace,
//     message: D,
//   }) {
//     super();
//     // props will not be defined if we do not construct ourselves
//     if (props) {
//       if ((CtorOf(props.message) as $DANGER<any>) === Object) {
//         throw new Error('Message must be instance of a class');
//       }

//       this.trace = props.trace;
//       this.dto = props.message;
//       this.name = ctorName(props.message);
//     }
//   }
// }
