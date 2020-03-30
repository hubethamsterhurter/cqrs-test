import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { SignupDto } from "../../domains/session/dto/signup.dto";

export class SignUpCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.SIGN_UP, SignupDto) {}