import { CreateMo } from '../helpers/create-mo.helper';
import { BaseDto } from '../base/base.dto';
import { IsString, IsObject } from 'class-validator';
import { IModel } from '../interfaces/interface.model';

export class ModelUpdatedSmDto<M extends IModel = IModel> extends BaseDto {
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
    CtorName: string
    model: M,
  }) {
    super();
    if (props) {
      this.CtorName = props.CtorName;
      this.model = props.model;
    }
  }
}

export class ModelUpdatedSmo<M extends IModel = IModel> extends CreateMo(ModelUpdatedSmDto)<ModelUpdatedSmDto<M>> {}