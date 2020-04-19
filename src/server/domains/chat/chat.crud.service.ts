import { BaseCrudService } from "../../base/base.crud.service";
import { Service } from "typedi";
import { ChatModel, IChatAttributes } from "./chat.model";

@Service()
export class ChatCrudService extends BaseCrudService<IChatAttributes, ChatModel>(ChatModel) {}
