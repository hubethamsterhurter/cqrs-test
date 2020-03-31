import ws from 'ws';
import { SocketClient } from "../../global/socket-client/socket-client";
import { IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDto } from '../../../shared/base/base.dto';
import { CreateSe } from '../../../shared/helpers/create-se.helper';

export class SCRawMessageSeDto extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  // is object or is string
  readonly data!: ws.Data;

  /**
   * @description
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient,
    readonly data: ws.Data,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.data = props.data;
    }
  }
}

export class SCRawMessageSeo extends CreateSe(SCRawMessageSeDto) {}
