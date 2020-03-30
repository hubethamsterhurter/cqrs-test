import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateClientMessageCtor } from "../../helpers/create-client-message-ctor.helper";
import { UserTypingCdto } from "../../domains/user/cdto/user-typing.cdto";

export class UserTypingCmo extends CreateClientMessageCtor(CLIENT_MESSAGE_TYPE.TYPING, UserTypingCdto) {}