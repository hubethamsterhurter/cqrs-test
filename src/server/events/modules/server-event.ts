import { AppHeartbeatSeo } from '../models/app-heartbeat.seo';
import { SocketServerCloseSeo } from '../models/socket-server.close.seo';
import { SocketServerConnectionSeo } from '../models/socket-server.connection.seo';
import { SocketServerErrorSeo } from '../models/socket-server.error.seo';
import { SocketServerHeadersSeo } from '../models/socket-server.headers.seo';
import { SocketServerListeningSeo } from '../models/socket-server.listening.seo';
import { SocketClientCloseSeo } from '../models/socket-client.close.seo';
import { SocketClientErrorSeo } from '../models/socket-client.error.seo';
import { SocketClientMessageSeo } from '../models/socket-client.message.seo';
import { SocketClientMessageParsedSeo } from '../models/socket-client.message-parsed.seo';
import { SocketClientMessageInvalidSeo } from '../models/socket-client.message-invalid.seo';
import { SocketClientMessageMalformedSeo } from '../models/socket-client.message-errored.seo';
import { SocketClientOpenSeo } from '../models/socket-client.open.seo';
import { SocketClientPingSeo } from '../models/socket-client.ping.seo';
import { SocketClientPongSeo } from '../models/socket-client.pong.seo';
import { SocketClientUpgradeSeo } from '../models/socket-client.upgrade.seo';
import { SocketClientUnexpectedResponseSeo } from '../models/socket-client.unexpected-response.seo';
import { ModelUpdatedSeo } from '../models/model-updated.seo';
import { ModelDeletedSeo } from '../models/model-deleted.seo';
import { ModelCreatedSeo } from '../models/model-created.seo';
import { UserSignedUpSeo } from '../models/user.signed-up.seo';
import { UserLoggedInSeo } from '../models/user.logged-in.seo';
import { UserLoggedOutSeo } from '../models/user.logged-out.seo';

export type ServerEventCtor =
  | typeof AppHeartbeatSeo
  | typeof SocketServerCloseSeo
  | typeof SocketServerConnectionSeo
  | typeof SocketServerErrorSeo
  | typeof SocketServerHeadersSeo
  | typeof SocketServerListeningSeo
  | typeof SocketClientCloseSeo
  | typeof SocketClientErrorSeo
  | typeof SocketClientMessageSeo
  | typeof SocketClientMessageParsedSeo
  | typeof SocketClientMessageInvalidSeo
  | typeof SocketClientMessageMalformedSeo
  | typeof SocketClientOpenSeo
  | typeof SocketClientPingSeo
  | typeof SocketClientPongSeo
  | typeof SocketClientUpgradeSeo
  | typeof SocketClientUnexpectedResponseSeo
  | typeof ModelCreatedSeo
  | typeof ModelUpdatedSeo
  | typeof ModelDeletedSeo
  | typeof UserSignedUpSeo
  | typeof UserLoggedInSeo
  | typeof UserLoggedOutSeo;

export type ServerEvent = ServerEventCtor['prototype'];
