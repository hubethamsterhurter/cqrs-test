import { SocketClient } from "../../web-sockets/socket-client/socket-client";
import { ValidationError, IsObject, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";
import { IMessage } from "../../../shared/interfaces/interface.message";
import { Constructor } from "../../../shared/types/constructor.type";

export class SCMessageInvalidSeDto<M extends IMessage = IMessage> extends BaseDto {
  @IsObject()
  @Type(() => SocketClient)
  readonly socket!: SocketClient;

  @IsArray()
  @Type(() => ValidationError)
  readonly errs!: ValidationError[];

  @IsObject()
  readonly MessageCtor!: Constructor<M>

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly socket: SocketClient;
    readonly errs: ValidationError[];
    readonly MessageCtor: Constructor<M>;
  }) {
    super();
    if (props) {
      this.socket = props.socket;
      this.errs = props.errs;
      this.MessageCtor = props.MessageCtor;
    }
  }
}

export class SCMessageInvalidSeo<M extends IMessage = IMessage> extends CreateSe(SCMessageInvalidSeDto)<SCMessageInvalidSeDto<M>> {}
