import { SocketClient } from "../web-sockets/socket-client/socket-client";
import { ValidationError, IsObject, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { Constructor } from "../../shared/types/constructor.type";
import { BaseEvent } from "../base/base.event";
import { BaseMessage } from "../../shared/base/base.message";

export class SCMessageInvalidEvent<M extends BaseMessage = BaseMessage> extends BaseEvent {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsArray()
  @Type(() => ValidationError)
  readonly errs!: ValidationError[];

  @IsObject()
  readonly MessageCtor!: Constructor<M>
}

