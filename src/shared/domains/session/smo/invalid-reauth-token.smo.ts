import { IsString, } from "class-validator";
import { BaseDto } from '../../../base/base.dto';
import { CreateMo } from '../../../helpers/create-mo.helper';

export class InvalidReauthTokenSmDto extends BaseDto {
  @IsString()
  readonly message!: string;

  @IsString()
  readonly invalidTokenId!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly message: string,
    readonly invalidTokenId: string,
  }) {
    super();
    if (props) {
      this.message = props.message;
      this.invalidTokenId = props.invalidTokenId;
    }
  }
}

export class InvalidReauthTokenSmo extends CreateMo(InvalidReauthTokenSmDto) {}
