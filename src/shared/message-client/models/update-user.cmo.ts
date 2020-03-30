import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { UpdateUserDto } from "../../domains/user/dto/update-user.dto";

export class UpdateUserCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.USER_UPDATE, UpdateUserDto) {}
