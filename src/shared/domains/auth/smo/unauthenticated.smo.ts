import { IsString, IsOptional } from "class-validator";
import { BaseDto } from "../../../base/base.dto";
import { CreateMo } from "../../../helpers/create-mo.helper";

export class UnauthenticatedSmDto extends BaseDto {
  @IsOptional()
  @IsString()
  readonly deletedAuthTokenId!: string | null;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly deletedAuthTokenId: string | null,
  }) {
    super();
    if (props) {
      this.deletedAuthTokenId = props.deletedAuthTokenId;
    }
  }
}

export class UnauthenticatedSmo extends CreateMo(UnauthenticatedSmDto) {}