import { CreateMo } from '../../../helpers/create-mo.helper';
import { IsObject, ValidateNested } from "class-validator";
import { BaseDto } from "../../../base/base.dto";
import { AuthTokenModel } from "../../auth-token/auth-token.model";
import { UserModel } from "../../user/user.model";
import { Type } from "class-transformer";

export class AuthenticatedSmDto extends BaseDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AuthTokenModel)
  readonly token!: AuthTokenModel;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly you!: UserModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly token: AuthTokenModel,
    readonly you: UserModel,
  }) {
    super();
    if (props) {
      this.token = props.token;
      this.you = props.you;
    }
  }
}

export class AuthenticatedSmo extends CreateMo(AuthenticatedSmDto) {}
