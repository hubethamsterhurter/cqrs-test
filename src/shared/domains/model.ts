import { UserModel } from "./user/user.model";
import { ChatModel } from "./chat/chat.model";

export type Model =
  | ChatModel
  | UserModel;
