import { fillThis } from "../../helpers/fill-this.helper";
import { IsString, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { BaseViewable } from "../../base/base.dto";

export class AuthTokenViewable extends BaseViewable {
  @IsString()
  readonly session_id!: string;

  @IsString()
  readonly user_id!: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly expires_at!: Date | null;

  constructor(props: AuthTokenViewable) { super(); fillThis.call(this, props); }
}