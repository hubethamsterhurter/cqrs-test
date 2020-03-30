import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { Equals, IsObject, ValidateNested, } from "class-validator";
import { UserModel } from '../../domains/user/user.model';
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.USER_UPDATED

export class ServerMessageUserUpdated implements ServerMessageType<SERVER_MESSAGE_TYPE['USER_UPDATED']> {
  static get _t() { return _t; }
  @Equals( _t) readonly _t = ServerMessageUserUpdated._t;

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