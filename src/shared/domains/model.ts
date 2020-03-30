import { UserModel } from "./user/user.model";
import { ChatModel } from "./chat/chat.model";
import { SessionModel } from "./session/session.model";
import { AuthTokenModel } from "./auth-token/auth-token.model";

export type Model =
  | ChatModel
  | UserModel
  | SessionModel
  | AuthTokenModel;
