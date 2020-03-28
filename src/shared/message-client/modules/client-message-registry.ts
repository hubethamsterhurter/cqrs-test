import { ClientMessageCreateUser } from "../models/client-message.create-user";
import { ClientMessageUpdateUser } from "../models/client-message.update-user";
import { ClientMessageUserTyping } from "../models/client-message.user-typing";
import { ClientMessageCreateChat } from "../models/client-message.create-chat";
import { ClientMessageSignUp } from "../models/client-message.sign-up";
import { ClientMessageLogIn } from "../models/client-message.log-in";
import { ClientMessageLogOut } from "../models/client-message.log-out";
import { Service } from "typedi";
import { LogConstruction } from "../../decorators/log-construction.decorator";
import { Registry } from "../../helpers/registry.helper";
import { UToKV } from "../../types/u-to-kv.type";

export type ClientMessageCtor =
  | typeof ClientMessageCreateUser
  | typeof ClientMessageUpdateUser
  | typeof ClientMessageUserTyping
  | typeof ClientMessageCreateChat
  | typeof ClientMessageSignUp
  | typeof ClientMessageLogIn
  | typeof ClientMessageLogOut;

export type ClientMessage = ClientMessageCtor['prototype'];

const CLIENT_MESSAGE_CTOR_MAP: UToKV<ClientMessageCtor, '_t'> = {
  [ClientMessageCreateUser._t]: ClientMessageCreateUser,
  [ClientMessageUpdateUser._t]: ClientMessageUpdateUser,
  [ClientMessageUserTyping._t]: ClientMessageUserTyping,
  [ClientMessageCreateChat._t]: ClientMessageCreateChat,
  [ClientMessageSignUp._t]: ClientMessageSignUp,
  [ClientMessageLogIn._t]: ClientMessageLogIn,
  [ClientMessageLogOut._t]: ClientMessageLogOut,
};

const CLIENT_MESSAGE_CTORS: ClientMessageCtor[] = Object.values(CLIENT_MESSAGE_CTOR_MAP);

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ClientMessageRegistry extends Registry<ClientMessageCtor, '_t'> {
  /**
   * @constructor
   */
  constructor() {
    super(CLIENT_MESSAGE_CTORS, '_t');
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
