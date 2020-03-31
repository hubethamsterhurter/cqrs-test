import { IsString } from "class-validator";
import { IDto } from "../interfaces/interface.dto";
import { ctorName } from "../helpers/ctor-name.helper";

export abstract class BaseDto implements IDto {
  @IsString()
  readonly _n = ctorName(this);
}