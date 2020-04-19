import { IsNumber, IsString } from "class-validator";
import { BaseMessage } from "../base/base.message";


export class ErrorBroadcast extends BaseMessage {
  @IsNumber()
  readonly code!: number;

  @IsString()
  readonly message!: string;
}
