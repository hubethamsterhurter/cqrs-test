import { CreateMo } from "../../../helpers/create-mo.helper";
import { BaseDto } from "../../../base/base.dto";

export class UserTypingCmDto extends BaseDto {}

export class UserTypingCmo extends CreateMo(UserTypingCmDto) {}