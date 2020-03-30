import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateCmoCtor } from "../../helpers/create-client-message-ctor.helper";
import { SignupCdto } from "../../domains/session/cdto/signup.cdto";

export class SignUpCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.SIGN_UP, SignupCdto) {}