import { BaseDto } from "../../../base/base.dto";
import { CreateMo } from "../../../helpers/create-mo.helper";

export class LogoutCmDto extends BaseDto {}

export class LogoutCmo extends CreateMo(LogoutCmDto) {};