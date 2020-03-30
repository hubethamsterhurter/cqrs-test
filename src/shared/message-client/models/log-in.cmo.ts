import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateClientMessageCtor } from "../../helpers/create-client-message-ctor.helper";
import { LoginCdto } from "../../domains/session/cdto/login.cdto";

export class LogInCmo extends CreateClientMessageCtor(CLIENT_MESSAGE_TYPE.LOG_IN, LoginCdto) {}
