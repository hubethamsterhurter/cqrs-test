import { Service, Inject } from "typedi";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserModel } from "../../../shared/domains/user/user.model";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SessionRepository } from "./session.repository";
import { SessionModel } from "../../../shared/domains/session/session.model";
import { UserLoggedInSeo, UserLoggedInSeDto } from "../../events/models/user.logged-in.seo";
import { UserLoggedOutSeo, UserLoggedOutSeDto } from "../../events/models/user.logged-out.seo";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { ReauthSessionTokenService } from "../auth-token/reauth-session-token.service";
import { UserRepository } from "../user/user.repository";
import { ReauthSessionTokenRepository } from "../auth-token/reauth-session-token.repository";


// TODO: timeout clients regularly with heartbeat

let __created__ = false;
@LogConstruction()
@Service({ global: true })
@SeConsumer()
export class SessionService {
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
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
    @Inject(() => SessionRepository) private readonly _sessionRepo: SessionRepository,
    @Inject(() => ReauthSessionTokenService) private readonly _reauthTokenService: ReauthSessionTokenService,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => ReauthSessionTokenRepository) private readonly _reauthTokenRepo: ReauthSessionTokenRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Log a user session in
   *
   * @param arg
   */
  async authenticate(arg: {
    session: SessionModel,
    user: UserModel,
    requester: UserModel | null,
    trace: Trace,
  }): Promise<void> {
    arg.session.user_id = arg.user.id;
    arg.session = await this._sessionRepo.upsert({
      inModel: arg.session,
      requester: arg.requester,
      trace: arg.trace,
    });
    const authToken = await this._reauthTokenService.create({
      unsaved: {
        user: arg.user,
        session: arg.session,
        expires_at: null,
      },
      trace: arg.trace,
    });
    this._eb.fire(new UserLoggedInSeo({
      dto: new UserLoggedInSeDto({
        authToken: authToken,
        session: arg.session,
        user: arg.user,
      }),
      trace: arg.trace.clone(),
    }));
  }



  /**
   * @description
   * Log a user session out
   *
   * @param arg
   */
  async logout(arg: {
    session: SessionModel,
    trace: Trace,
  }): Promise<void> {
    if (!arg.session.user_id) {
      this._log.info('Cannot log out session without a user_id');
      return;
    }

    const [
      user,
      token,
    ] =  await Promise.all([
      this._userRepo.findOneOrFail({ id: arg.session.user_id }),
      this._reauthTokenRepo.findOrFailByOriginalSessionId({ original_session_id: arg.session.id }),
    ]);

    this._eb.fire(new UserLoggedOutSeo({
      dto: new UserLoggedOutSeDto({
        session: arg.session,
        token: token,
        user: user,
      }),
      trace: arg.trace.clone(),
    }));
  }



  /**
   * @description
   * Delete a session
   *
   * @param arg
   */
  async delete(arg: {
    session: SessionModel,
    requester: UserModel,
    trace: Trace,
  }): Promise<SessionModel | null> {
    return await this._sessionRepo.delete({
      inModel: arg.session,
      requester: arg.requester,
      trace: arg.trace,
    });
  }
}
