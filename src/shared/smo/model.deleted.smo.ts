import { IsString, IsObject } from "class-validator";
import { BaseDto } from "../base/base.dto";
import { CreateMo } from "../helpers/create-mo.helper";

export class ModelDeletedSmDto<T extends object = object> extends BaseDto {
  @IsString()
  CtorName!: string

  @IsObject()
  model!: T;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    CtorName: string
  }) {
    super();
    if (props) {
      this.CtorName = props.CtorName;
    }
  }
}

export class ModelDeletedSmo extends CreateMo(ModelDeletedSmDto) {}