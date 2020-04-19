import 'reflect-metadata';
import { useContainer } from 'typeorm';
import { Container } from 'typedi';
import { EventBus } from './global/event-bus/event-bus';
import { EventStream } from './global/event-stream/event-stream';
import { SocketServerFactory } from './web-sockets/socket-server/socket-server.factory';
import { SocketServer } from './web-sockets/socket-server/socket-server';
import { ServerWatcher } from './global/watcher/sever-watcher';
import { Logger } from '../shared/helpers/class-logger.helper';
import { UserCrudService } from './domains/user/user.crud.service';
import { ChatCrudService } from './domains/chat/chat.crud.service';
import { SessionCrudService } from './domains/session/session.crud.service';
import { SocketWarehouse } from './web-sockets/socket-warehouse/socket-warehouse';
import { AuthGateway } from './domains/auth/auth.gateway';
import { UserGateway } from './domains/user/user.gateway';
import { ChatGateway } from './domains/chat/chat.gateway';
import { AuthTokenCrudService } from './domains/auth-token/auth-token.crud.service';
import { SessionRepository } from './domains/session/session.repository';
import { Trace } from '../shared/helpers/Tracking.helper';
import { SocketDoor } from './web-sockets/socket-door/socket.door';
import { MessageRegistry } from '../shared/util/message-registry.util';
import { MessageParser } from '../shared/util/message-parser.util';
import { DataChannel } from './web-sockets/socket-channels/data-channel';
import { EchoChannel } from './web-sockets/socket-channels/echo-channel';


useContainer(Container);


const _log = new Logger(bootstrap);

async function bootstrap() {

  Container.get(EventBus);
  const es = Container.get(EventStream);
  Container.get(MessageRegistry);
  Container.get(MessageParser);
  Container.set(SocketServer, Container.get(SocketServerFactory).create());
  Container.get(ServerWatcher);
  Container.get(UserCrudService);
  Container.get(ChatCrudService);
  Container.get(SessionCrudService);
  Container.get(SocketDoor);
  Container.get(SocketWarehouse);
  Container.get(AuthGateway);
  Container.get(UserGateway);
  Container.get(ChatGateway);
  Container.get(AuthTokenCrudService);
  Container.get(DataChannel);
  Container.get(EchoChannel);
  Container.get(SocketDoor);

  const sessionService = Container.get(SessionCrudService);
  const oldSessions = await (await Container.get(SessionRepository).find()).filter(session => session.deleted_at === null);
  const cleanupTrace = new Trace();
  for (const session of oldSessions) { await sessionService.delete({
    id: session.id,
    requester: null,
    trace: cleanupTrace,
  }) }
}

bootstrap();