import { Type } from 'class-transformer';
import { ValidationError, IsArray, IsString } from "class-validator";
import { CreateMo } from '../helpers/create-mo.helper';
import { BaseDto } from '../base/base.dto';

export class CmInvalidSmDto extends BaseDto {
  // do not bother validate nested
  @IsArray()
  @Type(() => ValidationError)
  readonly errors!: ValidationError[];

  @IsString()
  readonly MessageCtorName!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    errors: ValidationError[],
    MessageCtorName: string,
  }) {
    super();
    if (props) {
      this.errors = props.errors;
      this.MessageCtorName = props.MessageCtorName;
    }
  }
}

export class CmInvalidSmo extends CreateMo(CmInvalidSmDto) {}