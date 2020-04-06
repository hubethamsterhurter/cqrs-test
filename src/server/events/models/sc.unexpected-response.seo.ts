import { SocketClient } from "../../web-sockets/socket-client/socket-client";
import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SCUnexpectedResponseSeDto extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
    }
  }
}

export class SCUnexpectedResponseSeo extends CreateSe(SCUnexpectedResponseSeDto) {}
