import * as either from 'fp-ts/lib/Either';
import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "../../domains/session/session.repository";
import { SSConnectionSeo } from "../../events/models/ss.connection.seo";
import { SCCloseSeo } from "../../events/models/sc.close.seo";
import { SocketClientFactory } from "../socket-client/socket-client.factory";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { SubscribeEvent } from "../../decorators/subscribe-event.decorator";
import { SocketWarehouse } from "../socket-warehouse/socket-warehouse";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { AuthService } from "../../domains/auth/auth-service";
import { UserModel } from '../../../shared/domains/user/user.model';
import { UserRepository } from '../../domains/user/user.repository';
import { ChatRepository } from '../../domains/chat/chat.repository';
import { InitSmo, InitSmDto } from '../../../shared/smo/init.smo';
import { SessionCrudService } from '../../domains/session/session.crud.service';
import { InvalidAuthTokenSmo, InvalidAuthTokenSmDto } from '../../../shared/domains/auth-token/smo/invalid-auth-token.smo';


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@SeConsumer()
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
  @SubscribeEvent(SSConnectionSeo)
  private async _onSocketConnection(evt: SSConnectionSeo) {
    // find the corresponding token & user
    this._log.info('socket connected');
    const socketId = this._idFactory.create();
    const rememberToken =  evt.dto.req?.url?.match(/auth=([^&]*)/)?.[1];
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
      rawWebSocket: evt.dto.rawWebSocket,
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
      socket.send(new InvalidAuthTokenSmo({
        dto: new InvalidAuthTokenSmDto({
          invalidTokenId: rememberToken,
          message: 'Token expired',
        }),
        trace: evt.trace.clone(),
      }))
    }

    // TODO: send init after
    this._log.info('initialising socket');
    const [
      chats,
      users,
      sessions,
    ] = await Promise.all([
      this._chatRepo.findAll(),
      this._userRepo.findAll(),
      this._sessionRepo.findAll(),
    ]);
    const initMessage = new InitSmo({
      dto: new InitSmDto({
        sessions: sessions.filter(model => model.deleted_at === null),
        chats: chats.filter(model => model.deleted_at === null),
        users: users.filter(model => model.deleted_at === null),
      }),
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
  @SubscribeEvent(SCCloseSeo)
  private async _onSocketConnectionClose(evt: SCCloseSeo) {
    this._log.info(`Removing closed socket ${evt.dto.socket.id} (code: "${evt.dto.code}", reason: "${evt.dto.reason}")`);

    // disconnect session
    await this._sessionCrudService.update({
      fill: {},
      id: evt.dto.socket.session.id,
      disconnected_at: new Date(),
      user: undefined,
      // TODO: maybe someone else requested this?
      requester: evt.dto.socket.user,
      trace: evt.trace,
    });

    this._socketWarehouse.sockets.remove(evt.dto.socket);
  }
}
