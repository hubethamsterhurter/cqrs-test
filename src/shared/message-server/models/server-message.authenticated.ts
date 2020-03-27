import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals } from "class-validator";
import { VER } from "../../constants/ver";
import { UserModel } from '../../domains/user/user.model';

const _v = VER._0_1;
const _t = SERVER_MESSAGE_TYPE.AUTHENTICATED

export class ServerMessageAuthenticated implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['AUTHENTICATED']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(_v) readonly _v = ServerMessageAuthenticated._v;
  @Equals(_t) readonly _t = ServerMessageAuthenticated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  you!: UserModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { you: UserModel }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.you = props.you;
    }
  }
}