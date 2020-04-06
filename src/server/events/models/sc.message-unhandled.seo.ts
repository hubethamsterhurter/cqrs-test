import { SocketClient } from "../../web-sockets/socket-client/socket-client";
import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SCMessageUnhandledSeDto extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsObject()
  readonly message!: unknown;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient,
    readonly message: unknown,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.message = props.message;
    }
  }
}

export class SCMessageUnhandledSeo extends CreateSe(SCMessageUnhandledSeDto) {}
