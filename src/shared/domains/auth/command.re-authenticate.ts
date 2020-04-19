import { IsString } from "class-validator";
import { BaseMessage } from "../../base/base.message";

export class ReAuthenticateCommand extends BaseMessage {
  @IsString()
  readonly auth_token_id!: string;
}
