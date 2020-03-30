import { CLIENT_MESSAGE_TYPE } from "../modules/client-message-type";
import { CreateChatDto } from '../../domains/chat/dto/create-chat.dto';
import { CreateCmoCtor } from '../../helpers/create-client-message-ctor.helper';

export class CreateChatCmo extends CreateCmoCtor(CLIENT_MESSAGE_TYPE.CHAT_CREATE, CreateChatDto) {}