import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { ReAuthenticateDto } from "../../domains/session/dto/re-authenticate.dto";

export class ReAuthenticateCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.LOG_IN, ReAuthenticateDto) {}
