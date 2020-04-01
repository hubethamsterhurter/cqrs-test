import { IsObject, IsString } from "class-validator";
import { BaseDto } from "../../../shared/base/base.dto";
import { IModel } from "../../../shared/interfaces/interface.model";
import { ctorName } from "../../../shared/helpers/ctor-name.helper";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class ModelCreatedSeDto<M extends IModel = IModel> extends BaseDto {
  @IsObject()
  readonly model!: M;

  @IsString()
  readonly CTorName!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly model: M,
  }) {
    super();
    if (props) {
      this.model = props.model;
      this.CTorName = ctorName(props.model);
    }
  }
}

export class ModelCreatedSeo<M extends IModel = IModel> extends CreateSe(ModelCreatedSeDto)<ModelCreatedSeDto<M>> {}
