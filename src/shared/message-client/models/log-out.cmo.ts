import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { LogoutCdto } from "../../domains/session/cdto/logout.cdto";
import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";

export class LogOutCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.LOG_OUT, LogoutCdto) {}