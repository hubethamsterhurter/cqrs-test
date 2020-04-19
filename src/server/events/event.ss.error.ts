import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";

export class SSErrorEvent extends BaseEvent {
  @IsObject()
  @Type(() => Error)
  readonly err!: Error;
}
