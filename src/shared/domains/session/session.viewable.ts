import { Type } from "class-transformer";
import { IsString, IsOptional, IsDate } from "class-validator";
import { fillThis } from "../../helpers/fill-this.helper";
import { BaseViewable } from "../../base/base.dto";

export class SessionViewable extends BaseViewable {
  @IsString()
  socket_id!: string;

  @IsOptional()
  @IsString()
  user_id!: string | null;

  @IsDate()
  @Type(() => Date)
  connected_at!: Date;

  @IsDate()
  @Type(() => Date)
  disconnected_at!: Date | null;

  constructor(props: SessionViewable) { super(); fillThis.call(this, props); }
}
