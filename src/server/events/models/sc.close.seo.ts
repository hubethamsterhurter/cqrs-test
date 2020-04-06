import { SocketClient } from "../../web-sockets/socket-client/socket-client";
import { IsObject, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SCCloseSeDto extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsNumber()
  readonly code!: number;

  @IsString()
  readonly reason!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient,
    readonly code: number,
    readonly reason: string,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.code = props.code;
      this.reason = props.reason;
    }
  }
}

// socket client event
export class SCCloseSeo extends CreateSe(SCCloseSeDto) {}
