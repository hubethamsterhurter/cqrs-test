import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { LoginDto } from "../../domains/session/dto/login.dto";

export class LogInCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.LOG_IN, LoginDto) {}
