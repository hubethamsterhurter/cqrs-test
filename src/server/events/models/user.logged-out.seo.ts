import { UserModel } from "../../../shared/domains/user/user.model";
import { IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";
import { SocketClient } from "../../web-sockets/socket-client/socket-client";

export class UserLoggedOutSeDto extends BaseDto {
  @IsObject()
  readonly socket!: SocketClient;

  @IsObject()
  @ValidateNested()
  @Type(() => UserModel)
  readonly formerUser!: UserModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
      readonly socket: SocketClient,
      readonly formerUser: UserModel,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.formerUser = props.formerUser;
    }
  }
}

export class UserLoggedOutSeo extends CreateSe(UserLoggedOutSeDto) {}
