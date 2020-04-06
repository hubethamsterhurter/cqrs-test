import { CreateMo } from '../helpers/create-mo.helper';
import { IsString, IsObject } from "class-validator";
import { BaseDto } from "../base/base.dto";
import { IModel } from '../interfaces/interface.model';

export class ModelCreatedSmDto<M extends IModel = IModel> extends BaseDto {
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

export class ModelCreatedSmo<M extends IModel = IModel> extends CreateMo(ModelCreatedSmDto)<ModelCreatedSmDto<M>> {}