import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { UserCrudService } from "../user/user.crud.service";
import { UserRepository } from "../user/user.repository";
import { SubscribeMessage } from "../../decorators/subscribe-message.decorator";
import { SCMessageSeo } from "../../events/models/sc.message-parsed.seo";
import { ErrorSmo, ErrorSmDto } from "../../../shared/smo/error.smo";
import { SignupCmo } from "../../../shared/domains/auth/cmo/signup.cmo";
import { HTTP_CODE } from "../../../shared/constants/http-code.constant";
import { loginCmo } from "../../../shared/domains/auth/cmo/login.cmo";
import { LogoutCmo } from "../../../shared/domains/auth/cmo/logout.cmo";
import { AuthService } from "./auth-service";
import { USER_COLOUR } from "../../../shared/constants/user-colour";
import { Service, Inject } from "typedi";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
export class AuthGateway {
  private _log = new Logger(this);


  /**
   * @constructor
   */
  constructor(
    @Inject(() => UserCrudService) private readonly _userService: UserCrudService,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
    @Inject(() => AuthService) private readonly _authService: AuthService,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }




  /**
   * @description
   * Fired when as user tries to sign up
   *
   * @param evt
   */
  @SubscribeMessage(SignupCmo)
  async signUp(evt: SCMessageSeo<SignupCmo>) {
    // already signed in
    if (evt.dto.socket.user) {
      const msg = 'Cannot sign up: already logged in.'
      this._log.info(msg);
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

    const existingUser = await this._userRepo.findByUserName({ user_name: evt.dto.message.dto.user_name });

    // user already exists
    if (existingUser) {
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

    const newUser = await this._userService.create({
      fill: {
        colour: evt.dto.message.dto.colour || USER_COLOUR.BLACK,
      },
      password: evt.dto.message.dto.password,
      user_name: evt.dto.message.dto.user_name,
      requester: null,
      trace: evt.trace,
    })

    await this._authService.authenticateSocketUser({
      requester: newUser,
      socket: evt.dto.socket,
      user: newUser,
      trace: evt.trace,
    });
  }


  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @SubscribeMessage(loginCmo)
  async login(evt: SCMessageSeo<loginCmo>) {
    if (evt.dto.socket.user) {
      const msg = 'Cannot log in: already logged in.'
      this._log.info(msg);
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

    const matchedUser = await this._userRepo.findByUserName({ user_name: evt.dto.message.dto.user_name });

    if (!matchedUser) {
      // can't find user
      const msg = 'Cannot log in: user not found.';
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

    if (!this._authService.passwordMatch({
      user: matchedUser,
      password: evt.dto.message.dto.password,
    })) {
      // failed to log in
      const msg = 'Cannot log in: password does not match.';
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

    await this._authService.authenticateSocketUser({
      socket: evt.dto.socket,
      user: matchedUser,
      requester: matchedUser,
      trace: evt.trace,
    });
  }



  /**
   * @description
   * Fired when a user attempts to log in
   * 
   * @param evt 
   */
  @SubscribeMessage(LogoutCmo)
  async logout(evt: SCMessageSeo<LogoutCmo>) {
    const formerUser = evt.dto.socket.user;

    if (!formerUser) {
      this._log.info('Cannot log out: not logged in');
      evt.dto.socket.send(new ErrorSmo({
        dto: new ErrorSmDto({
          code: HTTP_CODE._422,
          message: 'Not logged in',
          trace: evt.trace.clone(),
        }),
        trace: evt.trace.clone(),
      }));
      return;
    }

    this._authService.unauthenticateSocketUser({
      socket: evt.dto.socket,
      trace: evt.trace,
    });
  }
}