import { SocketClient } from "../web-sockets/socket-client/socket-client";
import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";

export class SCMessageUnhandledEvent extends BaseEvent {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsObject()
  readonly message!: unknown;
}
