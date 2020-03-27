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
import { Model } from '../../../shared/domains/model';
import { ServerEventModelCreated } from '../models/server-event.model-created';
import { ServerEventUserSignedUp } from '../models/server-event.user.signed-up';
import { ServerEventUserLoggedIn } from '../models/server-event.user.logged-in';
import { ServerEventUserLoggedOut } from '../models/server-event.user.logged-out';

export type ServerEvent =
  | Readonly<ServerEventAppHeartbeat>
  | Readonly<ServerEventSocketServerClose>
  | Readonly<ServerEventSocketServerConnection>
  | Readonly<ServerEventSocketServerError>
  | Readonly<ServerEventSocketServerHeaders>
  | Readonly<ServerEventSocketServerListening>
  | Readonly<ServerEventSocketClientClose>
  | Readonly<ServerEventSocketClientError>
  | Readonly<ServerEventSocketClientMessage>
  | Readonly<ServerEventSocketClientMessageParsed>
  | Readonly<ServerEventSocketClientMessageInvalid>
  | Readonly<ServerEventSocketClientMessageMalformed>
  | Readonly<ServerEventSocketClientOpen>
  | Readonly<ServerEventSocketClientPing>
  | Readonly<ServerEventSocketClientPong>
  | Readonly<ServerEventSocketClientUpgrade>
  | Readonly<ServerEventSocketClientUnexpectedResponse>
  | Readonly<ServerEventModelCreated<Model>>
  | Readonly<ServerEventModelUpdated<Model>>
  | Readonly<ServerEventModelDeleted<Model>>
  | Readonly<ServerEventUserSignedUp>
  | Readonly<ServerEventUserLoggedIn>
  | Readonly<ServerEventUserLoggedOut>
