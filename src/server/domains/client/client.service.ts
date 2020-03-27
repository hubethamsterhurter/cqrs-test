import * as op from "rxjs/operators";
import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserModel } from "../../../shared/domains/user/user.model";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ClientRepository } from "./client.repository";
import { ServerEventSocketServerConnection } from "../../events/models/server-event.socket-server.connection";
import { ChatRepository } from "../chat/chat.repository";
import { UserRepository } from "../user/user.repository";
import { ServerMessageInit } from "../../../shared/message-server/models/server-message.init";
import { ServerEventModelCreated } from "../../events/models/server-event.model-created";
import { ServerEventModelUpdated } from "../../events/models/server-event.model-updated";
import { createdEventOf, updatedEventOf, deletedEventOf } from "../../helpers/server-model-event-filter.helper";
import { ServerMessageUserCreated } from "../../../shared/message-server/models/server-message.user.created";
import { ServerMessageChatCreated } from "../../../shared/message-server/models/server-message.chat.created";
import { ChatModel } from "../../../shared/domains/chat/chat.model";
import { ServerMessageUserUpdated } from "../../../shared/message-server/models/server-message.user.updated";
import { ServerEventSocketClientClose } from "../../events/models/server-event.socket-client.close";
import { ServerMessage } from "../../../shared/message-server/modules/server-message-registry";
import { SocketClient } from "../../global/socket-client/socket-client";
import { ClientModel } from "../../../shared/domains/connected-client/client.model";
import { ServerMessageClientCreated } from "../../../shared/message-server/models/server-message.client.created";
import { ServerMessageClientUpdated } from "../../../shared/message-server/models/server-message.client.updated";
import { ServerEventModelDeleted } from "../../events/models/server-event.model-deleted";
import { ServerMessageClientDeleted } from "../../../shared/message-server/models/server-message.client.deleted";
import { ServerEventUserSignedUp } from "../../events/models/server-event.user.signed-up";
import { ServerMessageAuthenticated } from "../../../shared/message-server/models/server-message.authenticated";
import { SocketClientFactory } from "../../global/socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventUserLoggedIn } from "../../events/models/server-event.user.logged-in";
import { ServerEventSocketClientMessageParsed } from "../../events/models/server-event.socket-client.message-parsed";
import { ClientMessageLogIn } from "../../../shared/message-client/models/client-message.log-in";
import { ofClientMessage } from "../../helpers/server-client-message-event-filter.helper";
import { ClientMessageLogOut } from "../../../shared/message-client/models/client-message.log-out";
import { ServerEventUserLoggedOut } from "../../events/models/server-event.user.logged-out";
import { ServerMessageLoggedOut } from "../../../shared/message-server/models/server-message.logged-out";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ClientService {
  private readonly _log = new ClassLogger(this);
  private _sockets: Map<string, SocketClient> = new Map();
  // get clients(): readonly SocketClient[] { return this._clients; }

  private _findSocketOrFail(id: string): SocketClient {
    const socket = this._sockets.get(id);
    if (!socket) throw new ReferenceError(`Unable to find client socket "${id}"`);
    return socket;
  }

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) readonly _es: ServerEventStream,
    @Inject(() => ClientRepository) readonly _clientRepo: ClientRepository,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => ChatRepository) private readonly _chatRepo: ChatRepository,
    @Inject(() => SocketClientFactory) private readonly _wscFactory: SocketClientFactory,
    @Inject(() => IdFactory) private readonly _idFactory: IdFactory,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    this._newConnectionEvents();
    this._initialiseClientEvents();
    this._modelEvents();
    this._authenticationEvents();
  }


  /**
   * @description
   * Broadcast model events
   */
  private _modelEvents() {
    // broadcast model created events
    this
      ._es
      .of(ServerEventModelCreated)
      .subscribe((evt) => {
        this._log.info('Broadcasting ServerEventModelCreated...', evt._p.CTor.name);
        if (createdEventOf(UserModel)(evt)) { this.broadcastAll(new ServerMessageUserCreated({ model: evt._p.model })); }
        else if (createdEventOf(ChatModel)(evt)) { this.broadcastAll(new ServerMessageChatCreated({ model: evt._p.model })); }
        else if (createdEventOf(ClientModel)(evt)) { this.broadcastAll(new ServerMessageClientCreated({ model: evt._p.model })); }
      });

    // broadcast model updated events
    this
      ._es
      .of(ServerEventModelUpdated)
      .subscribe((evt) => {
        this._log.info('Broadcasting ServerEventModelUpdated...', evt._p.CTor.name);
        if (updatedEventOf(UserModel)(evt)) { this.broadcastAll(new ServerMessageUserUpdated({ model: evt._p.model })); }
        else if (updatedEventOf(ClientModel)(evt)) { this.broadcastAll(new ServerMessageClientUpdated({ model: evt._p.model })); }
      });

    // broadcast model deleted events
    this
      ._es
      .of(ServerEventModelDeleted)
      .subscribe((evt) => {
        this._log.info('Broadcasting ServerEventModelDeleted...', evt._p.CTor.name);
        if (deletedEventOf(ClientModel)(evt)) { this.broadcastAll(new ServerMessageClientDeleted({ model: evt._p.model })); }
      });

    this
      ._es
      .of(ServerEventModelCreated)
  }


  /**
   * @description
   * Broadcast new connection events
   */
  private _newConnectionEvents() {
    this
      ._es
      .of(ServerEventSocketServerConnection)
      .subscribe(async (connectionEvt) => {
        this._log.info('socket connected');
        // this is cheating, (almost - doesn't bc models are normalised) causes circular reference & will slow down the IDE
        // - ClientSocket and Client reference each-other
        // so I don't have to create an efficient query mechanism to lookup each-other
        const clientId = this._idFactory.create();
        const clientSocket = this._wscFactory.create({
          id: this._idFactory.create(),
          client_id: clientId,
          rawWebSocket: connectionEvt._p.rawWebSocket,
        })
        this._sockets.set(clientSocket.id, clientSocket);
        const rawClient: UnsavedModel<ClientModel> = {
          user_id: null,
          socket_id: clientSocket.id,
          connected_at: new Date(),
          disconnected_at: null,
        }
        await this._clientRepo.create(rawClient, clientId);
      });

    // removed closed sockets
    this
      ._es
      .of(ServerEventSocketClientClose)
      .subscribe(async (evt) => {
        this._log.info(`Removing closed socket ${evt._p.socket.id} (code: "${evt._p.code}", reason: "${evt._p.reason}")`);
        this._sockets.delete(evt._p.socket.id);
        const client = await this._clientRepo.findOneOrFail(evt._p.socket.client_id);
        this._clientRepo.delete(client);
      });
  }


  /**
   * @description
   * On sign-up or log-in, authenticate user
   */
  private _authenticationEvents() {
    // log-in
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageLogIn)))
      .subscribe(async (evt) => {
        // authenticate user
        const oldClient = await this._clientRepo.findOneOrFail(evt._p.socket.id);
        const users = await this._userRepo.findAll();
        const targetUser = users.find(user => user.user_name === evt._p.message.user_name);

        if (!targetUser) {
          this._log.warn('Failed log-in - user doesn\'t exist');
          return;
        }

        if (targetUser.password !== evt._p.message.password) {
          this._log.warn('Failed log-in - password invalid');
          return;
        }

        // add user to client session
        oldClient.user_id = targetUser.id;
        await this._clientRepo.upsert(oldClient);
        this._eb.fire(new ServerEventUserLoggedIn({ user: targetUser }));
        evt._p.socket.send(new ServerMessageAuthenticated({ you: targetUser }));
      });

    // sign-up
    this
      ._es
      .of(ServerEventUserSignedUp)
      .subscribe(async (evt) => {
        // add user to client session
        const oldClient = await this._clientRepo.findOneOrFail(evt._p.socket.client_id);
        oldClient.user_id = evt._p.user.id;
        const client = await this._clientRepo.upsert(oldClient);
        const user = await this._userRepo.findOneOrFail(evt._p.user.id);
        this._eb.fire(new ServerEventUserLoggedIn({ user }));
        evt._p.socket.send(new ServerMessageAuthenticated({ you: evt._p.user }));
      });

    // log-out
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageLogOut)))
      .subscribe(async (evt) => {
        const oldClient = await this._clientRepo.findOneOrFail(evt._p.socket.id);
        if (!oldClient.user_id) {
          this._log.warn(`Can\'t log out socket "${evt._p.socket.id}" that isn\'t logged in`);
          return;
        }

        // remove user from session
        const user = await this._userRepo.findOneOrFail(oldClient.user_id);
        oldClient.user_id = null;
        await this._clientRepo.upsert(oldClient);

        this
          ._eb
          .fire(new ServerEventUserLoggedOut({ user }));

        evt
          ._p
          .socket
          .send(new ServerMessageLoggedOut());
      });
  }


  /**
   * @description
   * Broadcast initialisation message to get a client going
   */
  private _initialiseClientEvents() {
    this
      ._es
      .of(ServerEventModelCreated)
      .pipe(op.filter(createdEventOf(ClientModel)))
      .subscribe(async (evt) => {
        this._log.info('initialising client');
        const [
          chats,
          users,
          clients,
        ] = await Promise.all([
          this._chatRepo.findAll(),
          this._userRepo.findAll(),
          this._clientRepo.findAll(),
        ]);
        const socket = this._findSocketOrFail(evt._p.model.socket_id);
        socket.send(new ServerMessageInit({
          // doh!
          clients: clients.filter(model => model.deleted_at === null),
          chats: chats.filter(model => model.deleted_at === null),
          users: users.filter(model => model.deleted_at === null),
        }));
      });
  }


  /**
   * @description
   * Broadcast a message to all clients
   *
   * @param msg
   */
  broadcastAll(msg: ServerMessage) {
    this._sockets.forEach(wsc => wsc.send(msg));
  }


  /**
   * @description
   * Broadcast a message to other sockets
   *
   * @param msg
   * @param except
   */
  broadcastOthers(msg: ServerMessage, except: SocketClient) {
    this._sockets.forEach(wsc => { if (wsc.id !== except.id) wsc.send(msg); })
  }
}
