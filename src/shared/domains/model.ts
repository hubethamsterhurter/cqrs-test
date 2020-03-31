import { UserModel } from "./user/user.model";
import { ChatModel } from "./chat/chat.model";
import { SessionModel } from "./session/session.model";
import { ReauthSessionTokenModel } from "./auth-token/reauth-session-token.model";

export type ModelCtor =
  | typeof ChatModel
  | typeof UserModel
  | typeof SessionModel
  | typeof ReauthSessionTokenModel;


export type Model = ModelCtor['prototype'];
