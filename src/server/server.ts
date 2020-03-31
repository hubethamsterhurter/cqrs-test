import 'reflect-metadata';
import { Container } from 'typedi';
import { ServerEventBus } from './global/event-bus/server-event-bus';
import { ServerEventStream } from './global/event-stream/server-event-stream';
import { SocketServerFactory } from './global/socket-server/socket-server.factory';
import * as op from 'rxjs/operators';
import { AppHeartbeatSeo } from './events/models/app-heartbeat.seo';
import { SSListeningSeo } from './events/models/ss.listening.seo';
import { SCMessageSeo } from './events/models/sc.message-parsed.seo';
import { SCMessageInvalidSeo } from './events/models/sc.message-invalid.seo';
import { SCMessageMalformedSeo } from './events/models/sc.message-errored.seo';
import { SocketServer } from './global/socket-server/socket-server';
import { ServerWatcher } from './global/server-watcher/sever-watcher';
import { Logger } from '../shared/helpers/class-logger.helper';
import { UserService } from './domains/user/user.service';
import { ChatService } from './domains/chat/chat.service';
import { SessionService } from './domains/session/session.service';
import { ServerMessageRegistry } from '../shared/message-server/modules/server-message-registry';
import { ServerMessageParser } from '../shared/message-server/modules/server-message-parser';
import { ClientMessageRegistry } from '../shared/message-client/modules/client-message-registry';
import { ClientMessageParser } from '../shared/message-client/modules/client-message-parser';
import { SocketWarehouse } from './global/socket-warehouse/socket-warehouse';
import { SessionBroadcaster } from './domains/session/session.broadcaster';
import { SessionGateway } from './domains/session/session.gateway';
import { UserGateway } from './domains/user/user.gateway';
import { ChatGateway } from './domains/chat/chat.gateway';
import { ReauthSessionTokenService } from './domains/auth-token/reauth-session-token.service';
import { SessionRepository } from './domains/session/session.repository';
import { Trace } from '../shared/helpers/Tracking.helper';




async function bootstrap() {
  const _log = new Logger(bootstrap);

  Container.get(ServerEventBus);
  const es = Container.get(ServerEventStream);
  Container.set(SocketServer, Container.get(SocketServerFactory).create());
  Container.get(ServerWatcher);
  Container.get(UserService);
  Container.get(ChatService);
  Container.get(SessionService);
  Container.get(ServerMessageRegistry);
  Container.get(ServerMessageParser);
  Container.get(ClientMessageRegistry);
  Container.get(ClientMessageParser);
  Container.get(SocketWarehouse);
  Container.get(SessionBroadcaster);
  Container.get(SessionGateway);
  Container.get(UserGateway);
  Container.get(ChatGateway);
  Container.get(ReauthSessionTokenService);

  es
    .of(AppHeartbeatSeo)
    .subscribe((evt) => _log.info(' 1 ] hearbeat', evt._p.at))

  es
    .of(AppHeartbeatSeo)
    .pipe(op.take(5))
    .subscribe((evt) => _log.info(' 2 ] hearbeat', evt._p.at))

  es
    .of(SSListeningSeo)
    .subscribe((evt) => _log.info('socket server listening'));

  // successful message
  es
    .of(SCMessageSeo)
    .subscribe((evt) => _log.info(`Message parsed: ${evt._p.Ctor.name}`));

  // invalid message
  es
    .of(SCMessageInvalidSeo)
    .subscribe((evt) => _log.info('Message invalid:', evt._p.errs));

  // errored message
  es
    .of(SCMessageMalformedSeo)
    .subscribe((evt) => _log.info('Message invalid:', evt._p.err));

  es
    .all()
    .subscribe((evt) => _log.info(`\t -> \t EVENT           \t -> \t ${evt.constructor.name.padEnd(25, ' ')} \t -> \t ${evt.trace.origin_id}`));

  const sessionService = Container.get(SessionService);
  const oldSessions = await (await Container.get(SessionRepository).findAll()).filter(session => session.deleted_at === null);
  const cleanupTrace = new Trace();
  for (const session of oldSessions) { await sessionService.delete(session, cleanupTrace) }
}

bootstrap();