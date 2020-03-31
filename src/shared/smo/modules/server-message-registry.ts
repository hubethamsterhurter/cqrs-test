export {}
// import { ServerMessageUserCreated } from "../models/user.created.smo";
// import { ServerMessageUserUpdated } from "../models/user.updated.smo";
// import { UserTypingSmo } from "../models/user.typing.smo";
// import { ServerMessageChatCreated } from "../models/model.created.smo";
// import { InitSmo } from '../models/init.smo';
// import { ServerHeartbeatSmo } from "../models/server-heartbeat.smo";
// import { ServerMessageAuthenticated } from "../models/authenticated.smo";
// import { LoggedOutSmo } from "../models/logged-out.smo";
// import { ServerMessageSessionCreated } from "../models/session.created.smo";
// import { ServerMessageSessionUpdated } from "../models/session.updated.smo";
// import { ServerMessageSessionDeleted } from "../models/session.deleted.smo";
// import { ErrorSmo } from "../models/error.smo";
// import { Service } from "typedi";
// import { Registry } from "../../helpers/registry.helper";
// import { LogConstruction } from "../../decorators/log-construction.decorator";
// import { UToKV } from "../../types/u-to-kv.type";
// import { CmInvalidSmo } from "../models/cm.invalid.smo";
// import { CMMalformedSmo } from "../models/cm.malformed.smo";
// import { InvalidReauthTokenSmo } from "../models/invalid-reauth-token.smo";

// export type ServerMessageCtor = 
//   | typeof ServerMessageUserCreated
//   | typeof ServerMessageUserUpdated
//   | typeof UserTypingSmo
//   | typeof ServerMessageChatCreated
//   | typeof InitSmo
//   | typeof ServerHeartbeatSmo
//   | typeof ServerMessageAuthenticated
//   | typeof LoggedOutSmo
//   | typeof ServerMessageSessionCreated
//   | typeof ServerMessageSessionUpdated
//   | typeof ServerMessageSessionDeleted
//   | typeof CmInvalidSmo
//   | typeof CMMalformedSmo
//   | typeof ErrorSmo
//   | typeof InvalidReauthTokenSmo;

// export type ServerMessage = ServerMessageCtor['prototype']; 

// const SERVER_MESSAGE_CTOR_MAP: UToKV<ServerMessageCtor, '_t'> = {
//   [ServerMessageUserCreated._t]: ServerMessageUserCreated,
//   [ServerMessageUserUpdated._t]: ServerMessageUserUpdated,
//   [UserTypingSmo._t]: UserTypingSmo,
//   [ServerMessageChatCreated._t]: ServerMessageChatCreated,
//   [InitSmo._t]: InitSmo,
//   [ServerHeartbeatSmo._t]: ServerHeartbeatSmo,
//   [ServerMessageAuthenticated._t]: ServerMessageAuthenticated,
//   [LoggedOutSmo._t]: LoggedOutSmo,
//   [ServerMessageSessionCreated._t]: ServerMessageSessionCreated,
//   [ServerMessageSessionUpdated._t]: ServerMessageSessionUpdated,
//   [ServerMessageSessionDeleted._t]: ServerMessageSessionDeleted,
//   [CmInvalidSmo._t]: CmInvalidSmo,
//   [CMMalformedSmo._t]: CMMalformedSmo,
//   [ErrorSmo._t]: ErrorSmo,
//   [InvalidReauthTokenSmo._t]: InvalidReauthTokenSmo,
// }

// const SERVER_MESSAGE_CTORS: ServerMessageCtor[] = Object.values(SERVER_MESSAGE_CTOR_MAP);

// let __created__ = false;
// @Service({ global: true })
// @LogConstruction()
// export class ServerMessageRegistry extends Registry<ServerMessageCtor, '_t'> {
//   /**
//    * @constructor
//    */
//   constructor() {
//     super(SERVER_MESSAGE_CTORS, '_t');
//     if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
//     __created__ = true;
//   }
// }
