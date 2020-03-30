import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { UpdateUserCdto } from "../../domains/user/cdto/update-user.cdto";

export class UpdateUserCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.USER_UPDATE, UpdateUserCdto) {}
