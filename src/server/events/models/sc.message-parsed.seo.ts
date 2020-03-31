import { SocketClient } from "../../global/socket-client/socket-client";
import { IsObject } from "class-validator";
import { Type } from "class-transformer";
import { IMessage } from "../../../shared/interfaces/interface.message";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SCMessageSeDto<M extends IMessage = IMessage> extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsObject()
  readonly message!: M;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient,
    readonly message: M,
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.message = props.message;
    }
  }
}

export class SCMessageSeo<M extends IMessage = IMessage> extends CreateSe(SCMessageSeDto)<SCMessageSeDto<M>> {}
