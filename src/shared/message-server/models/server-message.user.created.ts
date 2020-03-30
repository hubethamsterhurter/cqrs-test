import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals, } from "class-validator";
import { UserModel } from '../../domains/user/user.model';
import { Trace } from '../../helpers/Tracking.helper';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Has_t } from '../../types/has-_t.type';
import { HasTrace } from '../../types/has-_o.type';

const _t = SERVER_MESSAGE_TYPE.USER_CREATED

// export function applyMixins<T extends ClassType<T>>(klass: T[]) {
  
// }

// class Base {}

// function _tMixin<T, U >(_t: T) {
//   return function apply_tMixin<U extends ClassType<any>>(_extends: U) {
//     abstract class _tMixin extends _extends implements Has_t<T> {
//       static get _t() { return _t; }
//       @Equals( _t) readonly _t = _t;
//     }
//     return _tMixin;
//   }
// }

// function _oMixin() {
//   return function apply_oMixin<U extends ClassType<any>>(_extends: U) {
//     abstract class _oMixin extends _extends implements Has_o {
//       @IsObject()
//       @ValidateNested()
//       @Type(() => Trace)
//       readonly _o!: Trace;
//     }
//     return _oMixin;
//   }
// }

// class Gay1 extends _tMixin(SERVER_MESSAGE_TYPE.USER_CREATED)(_oMixin()(Base)) {
//   //
// }

// const a = Gay1._t;
// const a = Gay1._o;
// const b = Gay1['prototype']._t

export class ServerMessageUserCreated implements ServerMessageType<SERVER_MESSAGE_TYPE['USER_CREATED']> {
  static get _t() { return _t; }
  @Equals( _t) readonly _t = ServerMessageUserCreated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly model!: UserModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    model: UserModel,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.trace = props._o;
      this.model = props.model;
    }
  }
}
