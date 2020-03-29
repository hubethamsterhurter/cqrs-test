import 'reflect-metadata';
import { Container } from 'typedi';
import { ServerEventBus } from './global/event-bus/server-event-bus';
import { ServerEventStream } from './global/event-stream/server-event-stream';
import { SocketServerFactory } from './global/socket-server/socket-server.factory';
import * as op from 'rxjs/operators';
import { ServerEventAppHeartbeat } from './events/models/server-event.app-heartbeat';
import { ServerEventSocketServerListening } from './events/models/server-event.socket-server.listening';
import { ServerEventSocketClientMessageParsed } from './events/models/server-event.socket-client.message-parsed';
import { ServerEventSocketClientMessageInvalid } from './events/models/server-event.socket-client.message-invalid';
import { ServerEventSocketClientMessageMalformed } from './events/models/server-event.socket-client.message-errored';
import { SocketServer } from './global/socket-server/socket-server';
import { ServerWatcher } from './global/server-watcher/sever-watcher';
import { ClassLogger } from '../shared/helpers/class-logger.helper';
import { UserService } from './domains/user/user.service';
import { ChatService } from './domains/chat/chat.service';
import { SessionService } from './domains/client/session.service';
import { ServerMessageRegistry } from '../shared/message-server/modules/server-message-registry';
import { ServerMessageParser } from '../shared/message-server/modules/server-message-parser';
import { ClientMessageRegistry } from '../shared/message-client/modules/client-message-registry';
import { ClientMessageParser } from '../shared/message-client/modules/client-message-parser';
import { SocketWarehouse } from './global/socket-warehouse/socket-warehouse';
import { SessionBroadcaster } from './domains/client/session.broadcaster';
import { SessionGateway } from './domains/client/session.gateway';




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

  es
    .of(ServerEventAppHeartbeat)
    .subscribe((evt) => _log.info(' 1 ] hearbeat', evt._p.at))

  es
    .of(ServerEventAppHeartbeat)
    .pipe(op.take(5))
    .subscribe((evt) => _log.info(' 2 ] hearbeat', evt._p.at))

  es
    .of(ServerEventSocketServerListening)
    .subscribe((evt) => _log.info('socket server listening'));

  // successful message
  es
    .of(ServerEventSocketClientMessageParsed)
    .subscribe((evt) => _log.info(`Message parsed: ${evt._p.Ctor.name}`));

  // invalid message
  es
    .of(ServerEventSocketClientMessageInvalid)
    .subscribe((evt) => _log.info('Message invalid:', evt._p.errs));

  // errored message
  es
    .of(ServerEventSocketClientMessageMalformed)
    .subscribe((evt) => _log.info('Message invalid:', evt._p.err));
}

bootstrap();