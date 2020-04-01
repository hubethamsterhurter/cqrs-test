import { Service, Inject } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { SessionService } from "./session.auth.service";
import { UserService } from "../user/user.service";
import { SessionRepository } from "./session.repository";
import { UserRepository } from "../user/user.repository";
import { HandleCm } from "../../decorators/handle-cm.decorator";
import { SCMessageSeo } from "../../events/models/sc.message-parsed.seo";
import { ErrorSmo, ErrorSmDto } from "../../../shared/smo/error.smo";
import { ReauthSessionTokenRepository } from "../auth-token/reauth-session-token.repository";
import { ReauthSessionTokenModel } from "../../../shared/domains/reauth-session-token/reauth-session-token.model";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { InvalidReauthTokenSmo, InvalidReauthTokenSmDto } from "../../../shared/domains/session/smo/invalid-reauth-token.smo";
import { ReAuthenticateCmo } from "../../../shared/domains/session/cmo/re-authenticate.cmo";
import { SignupCmo } from "../../../shared/domains/session/cmo/signup.cmo";
import { HTTP_CODE } from "../../../shared/constants/http-code.constant";
import { loginCmo } from "../../../shared/domains/session/cmo/login.cmo";
import { LogoutCmo } from "../../../shared/domains/session/cmo/logout.cmo";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
export class SessionGateway {
  private _log = new Logger(this);


  /**
   * @constructor
   */
  constructor(
    @Inject(() => SessionService) private readonly _sessionService: SessionService,
    @Inject(() => UserService) private readonly _userService: UserService,
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => ReauthSessionTokenRepository) private readonly _authTokenRepo: ReauthSessionTokenRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Fired when a user tries to authenticate using a re-authentication token
   *
   * @param evt
   */
  @HandleCm(ReAuthenticateCmo)
  async ReAuthenticate(evt: SCMessageSeo<ReAuthenticateCmo>) {
    const [
      token,
      session,
    ] = await Promise.all<ReauthSessionTokenModel | null, SessionModel>([
      this._authTokenRepo.findOne({ id: evt.dto.message.dto.auth_token_id }),
      this._sessionRepo.findOneOrFail({ id: evt.dto.socket.session_id }),
    ]);

    if (!token) {
      evt.dto.socket.send(new InvalidReauthTokenSmo({
        dto: new InvalidReauthTokenSmDto({
          message: `Failed to login. Auth token not found.`,
          invalidTokenId: evt.dto.message.dto.auth_token_id,
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    const now = Date.now();

    if (token.deleted_at !== null || (token.expires_at && (token.expires_at.valueOf() >= now ))) {
      evt.dto.socket.send(new InvalidReauthTokenSmo({
        dto: new InvalidReauthTokenSmDto({
          message: `Failed to log in. Your session has expired.`,
          invalidTokenId: evt.dto.message.dto.auth_token_id,
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    const user = await this._userRepo.findOne({ id: token.user_id });

    if (!user) {
      evt.dto.socket.send(new InvalidReauthTokenSmo({
        dto: new InvalidReauthTokenSmDto({
          message: `Failed to log in. User has been deleted.`,
          invalidTokenId: evt.dto.message.dto.auth_token_id,
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    await this._sessionService.authenticate({
      session: session,
      user: user,
      requester: user,
      trace: evt.trace,
    });
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @HandleCm(SignupCmo)
  async signUp(evt: SCMessageSeo<SignupCmo>) {
    const user = await this._userRepo.findByUserName({ user_name: evt.dto.message.dto.user_name });

    if (user) {
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          code: HTTP_CODE._422,
          message: `User ${evt.dto.message.dto.user_name} already exists`,
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    const session = await this._sessionRepo.findOneOrFail({ id: evt.dto.socket.session_id });
    await this._userService.signUp({
      dto: evt.dto.message.dto,
      trace: evt.trace,
      session,
    });
  }


  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @HandleCm(loginCmo)
  async logIn(evt: SCMessageSeo<loginCmo>) {
    const user = await this._userRepo.findByUserName({ user_name: evt.dto.message.dto.user_name });

    if (!user) {
      // can't find user
      const msg = 'Cannot log in. User not found.';
      this._log.warn(msg);
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          code: HTTP_CODE._404,
          message: msg,
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    if (!this._userService.passwordMatch({ user, password: evt.dto.message.dto.password, })) {
      // failed to log in
      const msg = 'Cannot log in. Password does not match.';
      this._log.warn(msg);
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          code: HTTP_CODE._422,
          message: msg,
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    const session = await this._sessionRepo.findOneOrFail({ id: evt.dto.socket.session_id });
    await this._sessionService.authenticate({
      session: session,
      user: user,
      requester: user,
      trace: evt.trace,
    });
  }



  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @HandleCm(LogoutCmo)
  async logOut(evt: SCMessageSeo<LogoutCmo>) {
    const session = await this._sessionRepo.findOneOrFail({ id: evt.dto.socket.session_id });
    await this._sessionService.logout({
      session,
      trace: evt.trace,
    });
  }
}