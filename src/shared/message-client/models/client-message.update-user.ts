import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { IsString, MaxLength, MinLength, IsOptional } from "class-validator";
import { USER_DEFINITION } from "../../domains/user/user.definition";
import { VER } from "../../constants/ver";

export class ClientMessageUpdateUser implements ClientMessageType<VER['_0_1'], CLIENT_MESSAGE_TYPE['USER_UPDATE']> {
  static get _v() { return VER._0_1; }
  static get _t() { return CLIENT_MESSAGE_TYPE.USER_UPDATE; }

  readonly _v = ClientMessageUpdateUser._v;
  readonly _t = ClientMessageUpdateUser._t;

  @IsString()
  readonly id!: string;

  @IsOptional()
  @MinLength(USER_DEFINITION.user_name.minLength)
  @MaxLength(USER_DEFINITION.user_name.maxLength)
  @IsString()
  readonly user_name?: string;

  @IsOptional()
  @MinLength(USER_DEFINITION.password.minLength)
  @MaxLength(USER_DEFINITION.password.maxLength)
  @IsString()
  readonly password?: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { id: string, user_name?: string, password?: string }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.id = props.id;
      this.user_name = props.user_name;
      this.password = props.password;
    }
  }
}
