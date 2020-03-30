import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateChatCdto } from '../../domains/chat/cdto/create-chat.cdto';
import { CreateCmoCtor } from '../../helpers/create-client-message-ctor.helper';

export class CreateChatCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.CHAT_CREATE, CreateChatCdto) {}