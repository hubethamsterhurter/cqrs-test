import { CreateMo } from '../helpers/create-mo.helper';
import { BaseDto } from '../base/base.dto';
import { IsString, IsObject } from 'class-validator';

export class ModelUpdatedSmDto<T extends object = object> extends BaseDto {
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
    model: T,
  }) {
    super();
    if (props) {
      this.CtorName = props.CtorName;
      this.model = props.model;
    }
  }
}
export class ModelUpdatedSmo extends CreateMo(ModelUpdatedSmDto) {}