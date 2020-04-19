import { IsDate } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";

export class AppHeartbeatEvent extends BaseEvent {
  @IsDate()
  @Type(() => Date)
  readonly at!: Date;
}
