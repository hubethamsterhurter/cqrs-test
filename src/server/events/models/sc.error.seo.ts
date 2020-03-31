import { SocketClient } from "../../global/socket-client/socket-client";
import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SCErrorSeDto extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsObject()
  @Type(() => Error)
  readonly err!: Error;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient,
    readonly err: Error,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.err = props.err;
    }
  }
}

export class SCErrorSeo extends CreateSe(SCErrorSeDto) {}