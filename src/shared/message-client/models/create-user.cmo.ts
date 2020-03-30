import { CreateUserCdto } from "../../domains/user/cdto/create-user.cdto";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";

export class CreateUserCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.USER_CREATE, CreateUserCdto) {}