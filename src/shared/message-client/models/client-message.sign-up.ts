import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { IsString, MaxLength, MinLength, Equals } from "class-validator";
import { USER_DEFINITION } from "../../domains/user/user.definition";
import { VER } from "../../constants/ver";

const _v = VER._0_1;
const _t = CLIENT_MESSAGE_TYPE.SIGN_UP;

export class ClientMessageSignUp implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['SIGN_UP']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals(_v) readonly _v = ClientMessageSignUp._v;
  @Equals(_t) readonly _t = ClientMessageSignUp._t;

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
