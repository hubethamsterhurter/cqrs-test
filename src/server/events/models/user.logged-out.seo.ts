import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ReauthSessionTokenModel } from "../../../shared/domains/reauth-session-token/reauth-session-token.model";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class UserLoggedOutSeDto extends BaseDto {
  @IsObject()
  @ValidateNested()
  @Type(() => SessionModel)
  readonly session!: SessionModel;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly user!: UserModel;

  @IsObject()
  @ValidateNested()
  @Type(() => ReauthSessionTokenModel)
  readonly token!: ReauthSessionTokenModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
      readonly session: SessionModel,
      readonly user: UserModel,
      readonly token: ReauthSessionTokenModel,
  }) {
    super();
    if (props) {
      this.session = props.session;
      this.user = props.user;
      this.token = props.token;
    }
  }
}

export class UserLoggedOutSeo extends CreateSe(UserLoggedOutSeDto) {}
