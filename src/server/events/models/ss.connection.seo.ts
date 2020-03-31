import ws from 'ws';
import { IncomingMessage } from "http";
import { IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../../../shared/base/base.dto';
import { CreateSe } from '../../../shared/helpers/create-se.helper';

export class SSConnectionSeDto extends BaseDto {
  @IsObject()
  @Type(() => IncomingMessage)
  readonly req!: IncomingMessage;

  @IsObject()
  @Type(() => ws)
  readonly rawWebSocket!: ws;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly req: IncomingMessage,
    readonly rawWebSocket: ws,
  }) {
    super();
    if (props) {
      this.req = props.req;
      this.rawWebSocket = props.rawWebSocket;
    }
  }
}

export class SSConnectionSeo extends CreateSe(SSConnectionSeDto) {}
