import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { LogoutDto } from "../../domains/session/dto/logout.dto";
import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";

export class LogOutCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.LOG_OUT, LogoutDto) {}