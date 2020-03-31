import { IsString } from "class-validator";
import { CreateMo } from "../../../helpers/create-mo.helper";
import { BaseDto } from "../../../base/base.dto";

export class DeleteChatCmDto extends BaseDto {
  @IsString()
  readonly id!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    id: string,
  }) {
    super();
    if (props) {
      this.id = props.id;
    }
  }
}

export class DeleteChatCmo extends CreateMo(DeleteChatCmDto) {};
