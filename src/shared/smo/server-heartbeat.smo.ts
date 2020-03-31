import { Type } from 'class-transformer';
import { IsDate } from "class-validator";
import { BaseDto } from '../base/base.dto';
import { CreateMo } from '../helpers/create-mo.helper';


export class ServerHeartbeatSmDto extends BaseDto {
  @IsDate()
  @Type(() => Date)
  readonly at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    at: Date
  }) {
    super();
    if (props) {
      this.at = props.at;
    }
  }
}

export class ServerHeartbeatSmo extends CreateMo(ServerHeartbeatSmDto) {}