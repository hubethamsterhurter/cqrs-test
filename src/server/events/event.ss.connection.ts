import ws from 'ws';
import { IncomingMessage } from "http";
import { IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEvent } from '../base/base.event';

export class SSConnectionEvent extends BaseEvent {
  @IsObject()
  @Type(() => IncomingMessage)
  readonly req!: IncomingMessage;

  @IsObject()
  @Type(() => ws)
  readonly rawWebSocket!: ws;
}
