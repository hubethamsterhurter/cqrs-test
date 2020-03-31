import { IncomingMessage } from "http";
import { IsObject, IsArray, IsString } from "class-validator";
import { Type } from "class-transformer";
import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SSHeadersSeDto extends BaseDto {
  @IsObject()
  @Type(() => IncomingMessage)
  readonly req!: IncomingMessage;

  @IsArray()
  @IsString()
  readonly headers!: string[];

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    readonly req: IncomingMessage,
    readonly headers: string[],
  }) {
    super();
    if (props) {
      this.req = props.req;
      this.headers = props.headers;
    }
  }
}

export class SSHeadersSeo extends CreateSe(SSHeadersSeDto) {}