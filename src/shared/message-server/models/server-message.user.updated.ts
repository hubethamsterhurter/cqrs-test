import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { Equals, IsObject, ValidateNested } from "class-validator";
import { VER } from "../../constants/ver";
import { UserModel } from '../../domains/user/user.model';

const _v = VER._0_1;
const _t = SERVER_MESSAGE_TYPE.USER_UPDATED

export class ServerMessageUserUpdated implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['USER_UPDATED']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(() => _v) readonly _v = ServerMessageUserUpdated._v;
  @Equals(() => _t) readonly _t = ServerMessageUserUpdated._t;

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