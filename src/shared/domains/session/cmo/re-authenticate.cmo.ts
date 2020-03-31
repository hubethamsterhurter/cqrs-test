import { IsString } from "class-validator";
import { BaseDto } from "../../../base/base.dto";
import { CreateMo } from "../../../helpers/create-mo.helper";

export class ReAuthenticateCmDto extends BaseDto {
  @IsString()
  readonly auth_token_id!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly auth_token_id: string,
  }) {
    super();
    if (props) {
      this.auth_token_id = props.auth_token_id;
    }
  }
}

export class LogoutCmo extends CreateMo(ReAuthenticateCmDto) {};