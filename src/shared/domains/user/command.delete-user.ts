import { IsString } from "class-validator";
import { BaseMessage } from "../../base/base.message";

export class DeleteUserCommand extends BaseMessage {
  @IsString()
  readonly id!: string;
}
