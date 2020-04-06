import * as tEither from 'fp-ts/lib/TaskEither';
import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { UserRepository } from "../user/user.repository";
import { AuthTokenRepository } from "../auth-token/auth-token.repository";
import { SessionCrudService } from "../session/session.crud.service";
import { UserModel } from '../../../shared/domains/user/user.model';
import { left, right } from 'fp-ts/lib/Either';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { AuthTokenCrudService } from '../auth-token/auth-token.crud.service';
import { AuthenticatedSmo, AuthenticatedSmDto } from '../../../shared/domains/auth/smo/authenticated.smo';
import { UserLoggedInSeo, UserLoggedInSeDto } from '../../events/models/user.logged-in.seo';
import { ServerEventBus } from '../../global/event-bus/server-event-bus';
import { SocketClient } from '../../web-sockets/socket-client/socket-client';
import { UnauthenticatedSmo, UnauthenticatedSmDto } from '../../../shared/domains/auth/smo/unauthenticated.smo';
import { UserLoggedOutSeo, UserLoggedOutSeDto } from '../../events/models/user.logged-out.seo';


let __created__ = false;
@LogConstruction()
@Service({ global: true })
@SeConsumer()
export class AuthService {
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
    @Inject(() => UserRepository) private readonly  _userRepository: UserRepository,
    @Inject(() => AuthTokenRepository) private readonly  _authTokenRepository: AuthTokenRepository,
    @Inject(() => SessionCrudService) private readonly  _sessionCrudService: SessionCrudService,
    @Inject(() => AuthTokenCrudService) private readonly  _authTokenCrudService: AuthTokenCrudService,
    @Inject(() => AuthTokenRepository) private readonly  _authTokenRepo: AuthTokenRepository,
    @Inject(() => ServerEventBus) private readonly  _eb: ServerEventBus,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Retrieve a user from a token_id if it can still be used for logging in
   * 
   * @param arg 
   */
  userFromTokenId(arg: {
    token_id: string
  }): tEither.TaskEither<string, UserModel> {
    const result: tEither.TaskEither<string, UserModel> = async () => {
      const token = await this._authTokenRepository.findOne({ id: arg.token_id });

      const now = Date.now();

      if (!token) return left('Invalid auth token');
      if (token.deleted_at && (token.deleted_at.valueOf() >= now)) return left('Expired token');
      
      const user = await this._userRepository.findOne({ id: token.user_id });
      if (!user) return left('Cannot find user');
      if (user.deleted_at && (user.deleted_at.valueOf() >= now)) return left('User is deleted');

      return right(user);
    };

    return result;
  }



  /**
   * @description
   * Log in
   *
   * @param arg
   */
  passwordMatch(arg: {
    user: UserModel,
    password: string,
  }): boolean {
    if (arg.user.password !== arg.password) return false;
    return true;
  }



  /**
   * @description
   * Log a user session in
   *
   * @param arg
   */
  async authenticateSocketUser(arg: {
    socket: SocketClient,
    user: UserModel,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<void> {
    // bind user to socket
    arg.socket.user = arg.user;

    const newToken = await this._authTokenCrudService.create({
      fill: {
        session: arg.socket.session,
        user: arg.user,
        // 30 days
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      trace: arg.trace,
    });

    const session = arg.socket.session;

    // add user to session
    await this._sessionCrudService.update({
      fill: {},
      id: session.id,
      user: arg.user,
      requester: arg.user,
      disconnected_at: undefined,
      trace: arg.trace,
    });

    // notify user
    arg.socket.send(new AuthenticatedSmo({
      dto: new AuthenticatedSmDto({
        token: newToken,
        you: arg.user,
      }),
      trace: arg.trace.clone(),
    }));

    // notify server
    this._eb.fire(new UserLoggedInSeo({
      dto: new UserLoggedInSeDto({
        session: arg.socket.session,
        user: arg.user,
      }),
      trace: arg.trace.clone(),
    }));
  }



  /**
   * @description
   * Unauthenticate (log out) a socket user
   * 
   * @param arg 
   */
  async unauthenticateSocketUser(arg: {
    socket: SocketClient,
    trace: Trace,
  }) {
    const formerUser = arg.socket.user;
    if (!formerUser) { return void this._log.info('Cannot log out socket: no user bound'); }

    arg.socket.user = null;

    let authToken = await this._authTokenRepo.findBySessionId({
      session_id: arg.socket.session.id
    });

    if (authToken) {
      authToken = await this._authTokenRepo.delete({
        id: authToken.id,
        requester: arg.socket.user,
        trace: arg.trace,
      });
    }

    let session = arg.socket.session;

    // remove user from session
    session = await this._sessionCrudService.update({
      fill: {},
      id: session.id,
      requester: formerUser,
      disconnected_at: undefined,
      user: formerUser,
      trace: arg.trace,
    });

    // notify user
    arg.socket.send(new UnauthenticatedSmo({
        dto: new UnauthenticatedSmDto({
          deletedAuthTokenId: authToken?.id ?? null,
        }),
        trace: arg.trace.clone(),
    }));

    // notify server
    this._eb.fire(new UserLoggedOutSeo({
      dto: new UserLoggedOutSeDto({
        socket: arg.socket,
        formerUser: formerUser,
      }),
      trace: arg.trace.clone(),
    }));
  }
}
