import { ServerMessageUserCreated } from "../models/server-message.user.created";
import { ServerMessageUserUpdated } from "../models/server-message.user.updated";
import { ServerMessageUserTyping } from "../models/server-message.user.typing";
import { ServerMessageChatCreated } from "../models/server-message.chat.created";
import { ServerMessageInit } from '../models/server-message.init';
import { ServerMessageServerHeartbeat } from "../models/server-message.server-heartbeat";
import { ServerMessageAuthenticated } from "../models/server-message.authenticated";
import { ServerMessageLoggedOut } from "../models/server-message.logged-out";
import { ServerMessageSessionCreated } from "../models/server-message.session.created";
import { ServerMessageSessionUpdated } from "../models/server-message.session.updated";
import { ServerMessageSessionDeleted } from "../models/server-message.session.deleted";
import { ServerMessageError } from "../models/server-message.error";
import { Service } from "typedi";
import { Registry } from "../../helpers/registry.helper";
import { LogConstruction } from "../../decorators/log-construction.decorator";
import { UToKV } from "../../types/u-to-kv.type";
import { ServerMessageClientMessageInvalid } from "../models/server-message.client-message-invalid";
import { ServerMessageClientMessageMalformed } from "../models/server-message.client-message-malformed";

export type ServerMessageCtor = 
  | typeof ServerMessageUserCreated
  | typeof ServerMessageUserUpdated
  | typeof ServerMessageUserTyping
  | typeof ServerMessageChatCreated
  | typeof ServerMessageInit
  | typeof ServerMessageServerHeartbeat
  | typeof ServerMessageAuthenticated
  | typeof ServerMessageLoggedOut
  | typeof ServerMessageSessionCreated
  | typeof ServerMessageSessionUpdated
  | typeof ServerMessageSessionDeleted
  | typeof ServerMessageClientMessageInvalid
  | typeof ServerMessageClientMessageMalformed
  | typeof ServerMessageError;

export type ServerMessage = ServerMessageCtor['prototype']; 

const SERVER_MESSAGE_CTOR_MAP: UToKV<ServerMessageCtor, '_t'> = {
  [ServerMessageUserCreated._t]: ServerMessageUserCreated,
  [ServerMessageUserUpdated._t]: ServerMessageUserUpdated,
  [ServerMessageUserTyping._t]: ServerMessageUserTyping,
  [ServerMessageChatCreated._t]: ServerMessageChatCreated,
  [ServerMessageInit._t]: ServerMessageInit,
  [ServerMessageServerHeartbeat._t]: ServerMessageServerHeartbeat,
  [ServerMessageAuthenticated._t]: ServerMessageAuthenticated,
  [ServerMessageLoggedOut._t]: ServerMessageLoggedOut,
  [ServerMessageSessionCreated._t]: ServerMessageSessionCreated,
  [ServerMessageSessionUpdated._t]: ServerMessageSessionUpdated,
  [ServerMessageSessionDeleted._t]: ServerMessageSessionDeleted,
  [ServerMessageClientMessageInvalid._t]: ServerMessageClientMessageInvalid,
  [ServerMessageClientMessageMalformed._t]: ServerMessageClientMessageMalformed,
  [ServerMessageError._t]: ServerMessageError,
}

const SERVER_MESSAGE_CTORS: ServerMessageCtor[] = Object.values(SERVER_MESSAGE_CTOR_MAP);

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerMessageRegistry extends Registry<ServerMessageCtor, '_t'> {
  /**
   * @constructor
   */
  constructor() {
    super(SERVER_MESSAGE_CTORS, '_t');
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}
