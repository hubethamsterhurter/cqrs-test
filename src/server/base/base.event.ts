import { IsString, IsObject, ValidateNested } from "class-validator";
import { Trace } from "../../shared/helpers/Tracking.helper";
import { ctorName } from "../../shared/helpers/ctor-name.helper";
import { Type } from "class-transformer";
import { Has_n } from "../../shared/types/has-_n.type";
import { Has_t } from "../../shared/types/has-_t.type";

export abstract class BaseEvent implements Has_n, Has_t<'evt'> {
  @IsString()
  readonly _t = 'evt';

  @IsString()
  readonly _n: string = ctorName(this);

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  trace!: Trace;
}
