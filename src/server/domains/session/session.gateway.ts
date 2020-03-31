import { Service, Inject } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { SEConsumer } from "../../decorators/se-consumer.decorator";
import { SessionService } from "./session.service";
import { UserService } from "../user/user.service";
import { SessionRepository } from "./session.repository";
import { UserRepository } from "../user/user.repository";
import { HandleCm } from "../../decorators/handle-cm.decorator";
import { SignUpCmo } from "../../../shared/message-client/models/sign-up.cmo";
import { SCMessageSeo } from "../../events/models/sc.message-parsed.seo";
import { ServerMessageError } from "../../../shared/message-server/models/server-message.error";
import { LogInCmo } from "../../../shared/message-client/models/log-in.cmo";
import { LogOutCmo } from "../../../shared/message-client/models/log-out.cmo";
import { ReAuthenticateCmo } from "../../../shared/message-client/models/re-authenticate.cmo";
import { ReauthSessionTokenRepository } from "../auth-token/reauth-session-token.repository";
import { ReauthSessionTokenModel } from "../../../shared/domains/auth-token/reauth-session-token.model";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { ServerMessageInvalidReauthToken } from "../../../shared/message-server/models/server-message.session-expired";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SEConsumer()
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
      this._authTokenRepo.findOne(evt._p.message.dto.auth_token_id),
      this._sessionRepo.findOneOrFail(evt._p.socket.session_id),
    ]);

    if (!token) {
      evt._p.socket.send(new ServerMessageInvalidReauthToken({
        trace: evt.trace.clone(),
        message: `Failed to login. Auth token not found.`,
        invalidTokenId: evt._p.message.dto.auth_token_id,
      }));
      return;
    }

    const now = Date.now();

    if (token.deleted_at !== null || (token.expires_at && (token.expires_at.valueOf() >= now ))) {
      evt._p.socket.send(new ServerMessageInvalidReauthToken({
        trace: evt.trace.clone(),
        message: `Failed to log in. Your session has expired.`,
        invalidTokenId: evt._p.message.dto.auth_token_id,
      }));
      return;
    }

    const user = await this._userRepo.findOne(token.user_id);

    if (!user) {
      evt._p.socket.send(new ServerMessageInvalidReauthToken({
        trace: evt.trace.clone(),
        message: `Failed to log in. User has been deleted.`,
        invalidTokenId: evt._p.message.dto.auth_token_id,
      }));
      return;
    }

    await this._sessionService.authenticate(
      session,
      user,
      evt.trace,
    );
  }


  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @HandleCm(SignUpCmo)
  async signUp(evt: SCMessageSeo<SignUpCmo>) {
    const user = await this._userRepo.findByUserName(evt._p.message.dto.user_name)

    if (user) {
      evt._p.socket.send(new ServerMessageError({
        trace: evt.trace.clone(),
        code: 422,
        message: `User ${evt._p.message.dto.user_name} already exists`,
      }));
      return;
    }

    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._userService.signUp(
      session,
      {
        user_name: evt._p.message.dto.user_name,
        password: evt._p.message.dto.password,
      },
      evt.trace,
    );
  }


  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @HandleCm(LogInCmo)
  async logIn(evt: SCMessageSeo<LogInCmo>) {
    const user = await this._userRepo.findByUserName(evt._p.message.dto.user_name);

    if (!user) {
      // can't find user
      const msg = 'Cannot log in. User not found.';
      this._log.warn(msg);
      evt._p.socket.send(new ServerMessageError({
        trace: evt.trace.clone(),
        code: 404,
        message: msg,
      }));
      return;
    }

    if (!this._userService.passwordMatch(user, evt._p.message.dto.password)) {
      // failed to log in
      const msg = 'Cannot log in. Password does not match.';
      this._log.warn(msg);
      evt._p.socket.send(new ServerMessageError({
        trace: evt.trace.clone(),
        code: 422,
        message: msg,
      }));
      return;
    }

    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._sessionService.authenticate(
      session,
      user,
      evt.trace,
    );
  }



  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @HandleCm(LogOutCmo)
  async logOut(evt: SCMessageSeo<LogOutCmo>) {
    const session = await this._sessionRepo.findOneOrFail(evt._p.socket.session_id);
    await this._sessionService.logout(session, evt.trace);
  }
}