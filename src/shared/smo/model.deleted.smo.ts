import { IsString, IsObject } from "class-validator";
import { BaseDto } from "../base/base.dto";
import { CreateMo } from "../helpers/create-mo.helper";
import { IModel } from "../interfaces/interface.model";

export class ModelDeletedSmDto<M extends IModel = IModel> extends BaseDto {
  @IsString()
  CtorName!: string

  @IsObject()
  model!: M;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    CtorName: string,
    model: M,
  }) {
    super();
    if (props) {
      this.CtorName = props.CtorName;
      this.model = props.model;
    }
  }
}

export class ModelDeletedSmo<M extends IModel = IModel> extends CreateMo(ModelDeletedSmDto)<ModelDeletedSmDto<M>> {}
