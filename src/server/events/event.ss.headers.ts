import { IncomingMessage } from "http";
import { IsObject, IsArray, IsString } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";

export class SSHeadersEvent extends BaseEvent {
  @IsObject()
  @Type(() => IncomingMessage)
  readonly req!: IncomingMessage;

  @IsArray()
  @IsString()
  readonly headers!: string[];
}
