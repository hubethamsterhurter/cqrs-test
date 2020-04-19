import * as either from 'fp-ts/lib/Either';
import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "../../domains/session/session.repository";
import { SocketClientFactory } from "../socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { SubscribeEvent } from "../../decorators/subscribe-event.decorator";
import { SocketWarehouse } from "../socket-warehouse/socket-warehouse";
import { EventStation } from "../../decorators/event-station.decorator";
import { AuthService } from "../../domains/auth/auth-service";
import { UserModel } from '../../domains/user/user.model';
import { UserRepository } from '../../domains/user/user.repository';
import { ChatRepository } from '../../domains/chat/chat.repository';
import { SessionCrudService } from '../../domains/session/session.crud.service';
import { SSConnectionEvent } from '../../events/event.ss.connection';
import { createMessage } from '../../../shared/helpers/create-message.helper';
import { InvalidAuthTokenBroadcast } from '../../../shared/domains/auth-token/broadcast.invalid-auth-token';
import { InitBroadcast } from '../../../shared/broadcasts/broadcast.init';
import { SCCloseEvent } from '../../events/event.sc.close';


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@EventStation()
export class SocketDoor {
  private readonly _log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _sessionRepo
   * @param _wscFactory
   * @param _idFactory
   * @param _socketWarehouse
   */
  constructor(
    @Inject(() => SocketClientFactory) private readonly _wscFactory: SocketClientFactory,
    @Inject(() => IdFactory) private readonly _idFactory: IdFactory,
    @Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse,
    @Inject(() => AuthService) private readonly  _authService: AuthService,
    @Inject(() => ChatRepository) private readonly  _chatRepo: ChatRepository,
    @Inject(() => SessionRepository) private readonly  _sessionRepo: SessionRepository,
    @Inject(() => SessionCrudService) private readonly  _sessionCrudService: SessionCrudService,
    @Inject(() => UserRepository) private readonly  _userRepo: UserRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Fired when a socket connects to the server
   *
   * @param evt
   */
  @SubscribeEvent(SSConnectionEvent)
  private async _onSocketConnection(evt: SSConnectionEvent) {
    // find the corresponding token & user
    this._log.info('socket connected');
    const socketId = this._idFactory.create();
    const rememberToken =  evt.req?.url?.match(/auth=([^&]*)/)?.[1];
    const eUser = rememberToken ? await this._authService.userFromTokenId({ token_id: rememberToken })() : null;
    const user: UserModel | null = eUser ? either.isRight(eUser) ? eUser.right : null : null;
    console.log('HANDLE CONNECTION', rememberToken, eUser);

    const now = new Date();

    const session = await this._sessionCrudService.create({
      fill: {},
      connected_at: now,
      disconnected_at: null,
      requester: user,
      socket_id: socketId,
      trace: evt.trace,
      user_id: user?.id ?? null,
    });

    const socket = this._wscFactory.create({
      id: socketId,
      user: user,
      session: session,
      rawWebSocket: evt.rawWebSocket,
    })

    this._socketWarehouse.sockets.add(socket);

    if (user) {
      //authenticate
      await this._authService.authenticateSocketUser({
        socket: socket,
        user: user,
        requester: user,
        trace: evt.trace,
      });
    } else if (rememberToken) {
      socket.send(createMessage(InvalidAuthTokenBroadcast, {
        invalidTokenId: rememberToken,
        message: 'Token expired',
        trace: evt.trace.clone(),
      }));
    }

    // TODO: send init after
    this._log.info('initialising socket');
    const [
      chats,
      users,
      sessions,
    ] = await Promise.all([
      this._chatRepo.find(),
      this._userRepo.find(),
      this._sessionRepo.find(),
    ]);
    const initMessage = createMessage(InitBroadcast, {
      sessions: sessions.filter(model => model.deleted_at === null),
      chats: chats.filter(model => model.deleted_at === null),
      users: users.filter(model => model.deleted_at === null),
      trace: evt.trace.clone(),
    });

    socket.send(initMessage);
  }



  /**
   * @description
   * Fired when a socket client disconnects
   * 
   * @param evt 
   */
  @SubscribeEvent(SCCloseEvent)
  private async _onSocketConnectionClose(evt: SCCloseEvent) {
    this._log.info(`Removing closed socket ${evt.socket.id} (code: "${evt.code}", reason: "${evt.reason}")`);

    // disconnect session
    await this._sessionCrudService.update({
      fill: {},
      id: evt.socket.session.id,
      disconnected_at: new Date(),
      user: undefined,
      // TODO: maybe someone else requested this?
      requester: evt.socket.user,
      trace: evt.trace,
    });

    this._socketWarehouse.sockets.remove(evt.socket);
  }
}
