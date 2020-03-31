import { Type } from 'class-transformer';
import { IsObject } from "class-validator";
import { BaseDto } from '../base/base.dto';
import { CreateMo } from '../helpers/create-mo.helper';

export class CmMalformedSmDto extends BaseDto {
  // do not bother validate nested
  @IsObject()
  @Type(() => Error)
  readonly error!: Error;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    error: Error,
  }) {
    super();
    if (props) {
      this.error = props.error;
    }
  }
}

export class CMMalformedSmo extends CreateMo(CmMalformedSmDto) {}
