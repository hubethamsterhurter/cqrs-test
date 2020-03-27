import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals } from "class-validator";
import { VER } from "../../constants/ver";
import { UserModel } from '../../domains/user/user.model';

const _v = VER._0_1;
const _t = SERVER_MESSAGE_TYPE.USER_CREATED

export class ServerMessageUserCreated implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['USER_CREATED']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals( _v) readonly _v = ServerMessageUserCreated._v;
  @Equals( _t) readonly _t = ServerMessageUserCreated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  model!: UserModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { model: UserModel }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.model = props.model;
    }
  }
}