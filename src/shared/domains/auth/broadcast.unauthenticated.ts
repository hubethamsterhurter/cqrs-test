import { IsString, IsOptional } from "class-validator";
import { BaseMessage } from "../../base/base.message";

export class UnauthenticatedBroadcast extends BaseMessage {
  @IsOptional()
  @IsString()
  readonly deletedAuthTokenId!: string | null;
}
