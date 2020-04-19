import { IsString, } from "class-validator";
import { BaseMessage } from "../../base/base.message";


export class InvalidAuthTokenBroadcast extends BaseMessage {
  @IsString()
  readonly message!: string;

  @IsString()
  readonly invalidTokenId!: string;
}
