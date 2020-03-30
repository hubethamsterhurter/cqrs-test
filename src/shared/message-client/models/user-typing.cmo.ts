import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { UserTypingDto } from "../../domains/user/dto/user-typing.dto";

export class UserTypingCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.TYPING, UserTypingDto) {}