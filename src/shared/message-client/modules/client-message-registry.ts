import { CreateUserCmo } from "../models/create-user.cmo";
import { UpdateUserCmo } from "../models/update-user.cmo";
import { UserTypingCmo } from "../models/user-typing.cmo";
import { CreateChatCmo } from "../models/create-chat.cmo";
import { SignUpCmo } from "../models/sign-up.cmo";
import { LogInCmo } from "../models/log-in.cmo";
import { LogOutCmo } from "../models/log-out.cmo";
import { Service } from "typedi";
import { LogConstruction } from "../../decorators/log-construction.decorator";
import { Registry } from "../../helpers/registry.helper";
import { UToKV } from "../../types/u-to-kv.type";

export type ClientMessageCtor =
  | typeof CreateUserCmo
  | typeof UpdateUserCmo
  | typeof UserTypingCmo
  | typeof CreateChatCmo
  | typeof SignUpCmo
  | typeof LogInCmo
  | typeof LogOutCmo;

export type ClientMessage = ClientMessageCtor['prototype'];

const CLIENT_MESSAGE_CTOR_MAP: UToKV<ClientMessageCtor, '_t'> = {
  [CreateUserCmo._t]: CreateUserCmo,
  [UpdateUserCmo._t]: UpdateUserCmo,
  [UserTypingCmo._t]: UserTypingCmo,
  [CreateChatCmo._t]: CreateChatCmo,
  [SignUpCmo._t]: SignUpCmo,
  [LogInCmo._t]: LogInCmo,
  [LogOutCmo._t]: LogOutCmo,
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
