import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { IsString, MaxLength, MinLength, Equals, IsObject, ValidateNested } from "class-validator";
import { USER_DEFINITION } from "../../domains/user/user.definition";
import { Type } from "class-transformer";
import { Trace } from "../../helpers/Tracking.helper";

const _t = CLIENT_MESSAGE_TYPE.USER_CREATE;

export class ClientMessageCreateUser implements ClientMessageType<CLIENT_MESSAGE_TYPE['USER_CREATE']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ClientMessageCreateUser._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

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
  constructor(props: {
    _o: Trace,
    user_name: string,
    password: string,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.user_name = props.user_name;
      this.password = props.password;
    }
  }
}
