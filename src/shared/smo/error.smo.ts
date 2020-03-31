import { IsNumber, IsString } from "class-validator";
import { Trace } from '../helpers/Tracking.helper';
import { BaseDto } from '../base/base.dto';
import { CreateMo } from '../helpers/create-mo.helper';


export class ErrorSmDto extends BaseDto {
  @IsNumber()
  readonly code!: number;

  @IsString()
  readonly message!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    trace: Trace,
    message: string,
    code: number,
  }) {
    super();
    if (props) {
      this.message = props.message;
      this.code = props.code;
    }
  }
}

export class ErrorSmo extends CreateMo(ErrorSmDto) {}
