import { SocketClient } from "../web-sockets/socket-client/socket-client";
import { IsObject, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";

export class SCCloseEvent extends BaseEvent {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsNumber()
  readonly code!: number;

  @IsString()
  readonly reason!: string;
}

