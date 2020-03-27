import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { IsString, MaxLength, MinLength } from "class-validator";
import { USER_DEFINITION } from "../../domains/user/user.definition";
import { VER } from "../../constants/ver";

export class ClientMessageCreateUser implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['USER_CREATE']> {
  static get _v() { return VER._0_1; }
  static get _t() { return CLIENT_MESSAGE_TYPE.USER_CREATE; }

  readonly _v = ClientMessageCreateUser._v;
  readonly _t = ClientMessageCreateUser._t;

  @MinLength(USER_DEFINITION.user_name.minLength)
  @MaxLength(USER_DEFINITION.user_name.maxLength)
  @IsString()
  readonly user_name!: string;

  @MinLength(USER_DEFINITION.password.minLength)
  @MaxLength(USER_DEFINITION.password.maxLength)
  @IsString()
  readonly password!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { user_name: string, password: string }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.user_name = props.user_name;
      this.password = props.password;
    }
  }
}
