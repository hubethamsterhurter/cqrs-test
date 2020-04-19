import { EntityRepository } from "typeorm";
import { ChatModel, IChatAttributes } from "./chat.model";
import { BaseRepository } from "../../base/base.repository";
import { ChatLang } from "../../lang/strings/model.chat.lang";
import { Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";

@EntityRepository(ChatModel)
@Service()
@LogConstruction()
export class ChatRepository extends BaseRepository<IChatAttributes, ChatModel> {
  protected ModelCtor = ChatModel;
  protected modelLang = new ChatLang({});
}