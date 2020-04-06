import { UserModel } from "../../../shared/domains/user/user.model";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class UserLoggedInSeDto extends BaseDto {
  @IsObject()
  @ValidateNested()
  @Type(() => SessionModel)
  readonly session!: SessionModel;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly user!: UserModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly session: SessionModel,
    readonly user: UserModel,
  }) {
    super();
    if (props) {
      this.session = props.session;
      this.user = props.user;
    }
  }
}

export class UserLoggedInSeo extends CreateSe(UserLoggedInSeDto) {}
