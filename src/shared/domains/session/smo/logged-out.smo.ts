import { IsString } from "class-validator";
import { BaseDto } from "../../../base/base.dto";
import { CreateMo } from "../../../helpers/create-mo.helper";

export class LoggedOutSmDto extends BaseDto {
  @IsString()
  readonly deletedReauthTokenId!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly deletedReauthTokenId: string,
  }) {
    super();
    if (props) {
      this.deletedReauthTokenId = props.deletedReauthTokenId;
    }
  }
}

export class LoggedOutSmo extends CreateMo(LoggedOutSmDto) {}