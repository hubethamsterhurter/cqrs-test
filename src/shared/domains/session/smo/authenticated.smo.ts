import { CreateMo } from '../../../helpers/create-mo.helper';
import { IsObject, ValidateNested } from "class-validator";
import { BaseDto } from "../../../base/base.dto";
import { ReauthSessionTokenModel } from "../../reauth-session-token/reauth-session-token.model";
import { UserModel } from "../../user/user.model";
import { Type } from "class-transformer";

export class AuthenticatedSmDto extends BaseDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ReauthSessionTokenModel)
  readonly token!: ReauthSessionTokenModel;

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
    readonly token: ReauthSessionTokenModel,
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
