import 'reflect-metadata';
import { Container } from 'typedi';
import { ServerEventBus } from './global/event-bus/server-event-bus';
import { ServerEventStream } from './global/event-stream/server-event-stream';
import { SocketServerFactory } from './global/socket-server/socket-server.factory';
import * as op from 'rxjs/operators';
import { AppHeartbeatSeo } from './events/models/app-heartbeat.seo';
import { SocketServerListeningSeo } from './events/models/socket-server.listening.seo';
import { SocketClientMessageParsedSeo } from './events/models/socket-client.message-parsed.seo';
import { SocketClientMessageInvalidSeo } from './events/models/socket-client.message-invalid.seo';
import { SocketClientMessageMalformedSeo } from './events/models/socket-client.message-errored.seo';
import { SocketServer } from './global/socket-server/socket-server';
import { ServerWatcher } from './global/server-watcher/sever-watcher';
import { ClassLogger } from '../shared/helpers/class-logger.helper';
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




async function bootstrap() {
  const _log = new ClassLogger(bootstrap);

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

  es
    .of(AppHeartbeatSeo)
    .subscribe((evt) => _log.info(' 1 ] hearbeat', evt._p.at))

  es
    .of(AppHeartbeatSeo)
    .pipe(op.take(5))
    .subscribe((evt) => _log.info(' 2 ] hearbeat', evt._p.at))

  es
    .of(SocketServerListeningSeo)
    .subscribe((evt) => _log.info('socket server listening'));

  // successful message
  es
    .of(SocketClientMessageParsedSeo)
    .subscribe((evt) => _log.info(`Message parsed: ${evt._p.Ctor.name}`));

  // invalid message
  es
    .of(SocketClientMessageInvalidSeo)
    .subscribe((evt) => _log.info('Message invalid:', evt._p.errs));

  // errored message
  es
    .of(SocketClientMessageMalformedSeo)
    .subscribe((evt) => _log.info('Message invalid:', evt._p.err));
}

bootstrap();