import { SocketClient } from "../web-sockets/socket-client/socket-client";
import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseEvent } from "../base/base.event";
import { BaseMessage } from "../../shared/base/base.message";

export class SCMessageEvent<M extends BaseMessage = BaseMessage> extends BaseEvent {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsObject()
  readonly message!: M;
}

