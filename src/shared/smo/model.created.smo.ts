import { CreateMo } from '../helpers/create-mo.helper';
import { IsString, IsObject } from "class-validator";
import { BaseDto } from "../base/base.dto";

export class ModelCreatedSmDto<T extends object = object> extends BaseDto {
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

export class ModelCreatedSmo extends CreateMo(ModelCreatedSmDto) {}