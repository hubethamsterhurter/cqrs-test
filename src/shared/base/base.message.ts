import { ctorName } from "../../shared/helpers/ctor-name.helper";
import { IsString, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Trace } from "../../shared/helpers/Tracking.helper";
import { Has_n } from "../types/has-_n.type";
import { Has_t } from "../types/has-_t.type";

export abstract class BaseMessage implements Has_n, Has_t<'msg'> {
  @IsString()
  readonly _t = 'msg';

  @IsString()
  readonly _n: string = ctorName(this)

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;
}
