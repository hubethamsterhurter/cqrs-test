import { ClientMessageType, CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { IsString, MaxLength, MinLength, IsOptional, Equals, IsObject, ValidateNested } from "class-validator";
import { USER_DEFINITION } from "../../domains/user/user.definition";
import { Trace } from "../../helpers/Tracking.helper";
import { Type } from "class-transformer";

const _t = CLIENT_MESSAGE_TYPE.USER_UPDATE;

export class ClientMessageUpdateUser implements ClientMessageType<CLIENT_MESSAGE_TYPE['USER_UPDATE']> {
  static get _t() { return _t; }
  @Equals( _t) readonly _t = ClientMessageUpdateUser._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

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
  constructor(props: {
    _o: Trace,
    id: string,
    user_name?: string,
    password?: string
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.id = props.id;
      this.user_name = props.user_name;
      this.password = props.password;
    }
  }
}
