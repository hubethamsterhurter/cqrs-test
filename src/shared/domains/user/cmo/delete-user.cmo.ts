import { IsString } from "class-validator";
import { BaseDto } from "../../../base/base.dto";
import { CreateMo } from "../../../helpers/create-mo.helper";

export class DeleteUserCmDto extends BaseDto {
  @IsString()
  readonly id!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly id: string,
  }) {
    super();
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.id = props.id;
    }
  }
}

export class DeleteUserCmo extends CreateMo(DeleteUserCmDto) {}