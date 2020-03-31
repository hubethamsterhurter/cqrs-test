import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SSErrorSeDto extends BaseDto {
  @IsObject()
  @Type(() => Error)
  readonly err!: Error;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    err: Error,
  }) {
    super();
    if (props) {
      this.err = props.err;
    }
  }
}

export class SSErrorSeo extends CreateSe(SSErrorSeDto) {}
