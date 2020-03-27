import { UserModel } from "./user/user.model";
import { ChatModel } from "./chat/chat.model";
import { ClientModel } from "./connected-client/client.model";

export type Model =
  | ChatModel
  | UserModel
  | ClientModel;
