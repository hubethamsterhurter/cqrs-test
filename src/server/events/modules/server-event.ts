import { ServerEventAppHeartbeat } from '../models/server-event.app-heartbeat';
import { ServerEventSocketServerClose } from '../models/server-event.socket-server.close';
import { ServerEventSocketServerConnection } from '../models/server-event.socket-server.connection';
import { ServerEventSocketServerError } from '../models/server-event.socket-server.error';
import { ServerEventSocketServerHeaders } from '../models/server-event.socket-server.headers';
import { ServerEventSocketServerListening } from '../models/server-event.socket-server.listening';
import { ServerEventSocketClientClose } from '../models/server-event.socket-client.close';
import { ServerEventSocketClientError } from '../models/server-event.socket-client.error';
import { ServerEventSocketClientMessage } from '../models/server-event.socket-client.message';
import { ServerEventSocketClientMessageParsed } from '../models/server-event.socket-client.message-parsed';
import { ServerEventSocketClientMessageInvalid } from '../models/server-event.socket-client.message-invalid';
import { ServerEventSocketClientMessageMalformed } from '../models/server-event.socket-client.message-errored';
import { ServerEventSocketClientOpen } from '../models/server-event.socket-client.open';
import { ServerEventSocketClientPing } from '../models/server-event.socket-client.ping';
import { ServerEventSocketClientPong } from '../models/server-event.socket-client.pong';
import { ServerEventSocketClientUpgrade } from '../models/server-event.socket-client.upgrade';
import { ServerEventSocketClientUnexpectedResponse } from '../models/server-event.socket-client.unexpected-response';
import { ServerEventModelUpdated } from '../models/server-event.model-updated';
import { ServerEventModelDeleted } from '../models/server-event.model-deleted';
import { ServerEventModelCreated } from '../models/server-event.model-created';
import { ServerEventUserSignedUp } from '../models/server-event.user.signed-up';
import { ServerEventUserLoggedIn } from '../models/server-event.user.logged-in';
import { ServerEventUserLoggedOut } from '../models/server-event.user.logged-out';

export type ServerEventCtor =
  | typeof ServerEventAppHeartbeat
  | typeof ServerEventSocketServerClose
  | typeof ServerEventSocketServerConnection
  | typeof ServerEventSocketServerError
  | typeof ServerEventSocketServerHeaders
  | typeof ServerEventSocketServerListening
  | typeof ServerEventSocketClientClose
  | typeof ServerEventSocketClientError
  | typeof ServerEventSocketClientMessage
  | typeof ServerEventSocketClientMessageParsed
  | typeof ServerEventSocketClientMessageInvalid
  | typeof ServerEventSocketClientMessageMalformed
  | typeof ServerEventSocketClientOpen
  | typeof ServerEventSocketClientPing
  | typeof ServerEventSocketClientPong
  | typeof ServerEventSocketClientUpgrade
  | typeof ServerEventSocketClientUnexpectedResponse
  | typeof ServerEventModelCreated
  | typeof ServerEventModelUpdated
  | typeof ServerEventModelDeleted
  | typeof ServerEventUserSignedUp
  | typeof ServerEventUserLoggedIn
  | typeof ServerEventUserLoggedOut;

export type ServerEvent = ServerEventCtor['prototype'];
