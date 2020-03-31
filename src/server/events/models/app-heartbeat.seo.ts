import { IsDate } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class AppHeartbeatSeDto extends BaseDto {
  @IsDate()
  @Type(() => Date)
  readonly at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly at: Date,
  }) {
    super();
    if (props) {
      this.at = props.at;
    }
  }
}

export class AppHeartbeatSeo extends CreateSe(AppHeartbeatSeDto) {}
