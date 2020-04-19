import * as opt from 'fp-ts/lib/Option';
import * as op from 'rxjs/operators';
import { Logger } from '../../shared/helpers/class-logger.helper';
import { WsConnection } from './ws-connection';
import { UserModel } from '../../server/domains/user/user.model';
import { Observable, Subject, BehaviorSubject, timer, race } from 'rxjs';
import { AuthenticatedBroadcast } from '../../shared/domains/auth/broadcast.authenticated';
import { UnauthenticatedSmo } from '../../shared/domains/auth/broadcast.unauthenticated';
import { Delta } from '../../shared/types/delta.type';
import { loginCmo } from '../../shared/domains/auth/command.login';
import { LogoutCommand } from '../../shared/domains/auth/command.logout';
import { SignupCommand } from '../../shared/domains/auth/command.signup';
import { LOCAL_STORAGE_AUTH_KEY } from '../constants/local-storage-auth-key.constant';
import { InvalidAuthTokenBroadcast, InvalidAuthTokenBroadcast } from '../../shared/domains/auth-token/broadcast.invalid-auth-token';



export interface AuthenticatingState { status: 'authenticating', user: null }
export interface AuthenticatedState { status: 'authenticated', user: UserModel }
export interface UnauthenticatedState { status: 'unauthenticated', user: null }

export type AuthState =
  | AuthenticatingState
  | AuthenticatedState
  | UnauthenticatedState



const initialAuthState: AuthState = {
  status: 'unauthenticated',
  user: null,
};


export type AuthDelta = Delta<AuthState>;


let __created__ = false;
export class Auth {
  readonly #log = new Logger(this);
  readonly delta$: Observable<AuthDelta>;
  readonly state$: BehaviorSubject<AuthState> = new BehaviorSubject(initialAuthState);
  readonly authenticated$: Observable<AuthenticatedBroadcast>;
  readonly unauthenticated$: Observable<UnauthenticatedSmo>;

  readonly #authenticate$: Subject<SignupCommand | loginCmo> = new Subject();


  /**
   * @constructor
   *
   * @param _connection
   */
  constructor(
    private readonly _connection: WsConnection,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    const self = this;
    if (window) { Object.defineProperty(window, '_AUTH', { get() { return self.state$.getValue(); } }) };

    const authenticated$ = _connection.messageOf$(AuthenticatedBroadcast);
    const unauthenticated$ = _connection.messageOf$(UnauthenticatedSmo);

    authenticated$.subscribe((message) => this.state$.next({ status: 'authenticated', user: message.dto.you }));
    unauthenticated$.subscribe((message) => this.state$.next({ status: 'unauthenticated', user: null }));

    const delta$ = this.state$.pipe(
      op.scan<AuthState, AuthDelta>(
        (acc, next) => ({ old: acc.new, new: next }),
        { old: this.state$.getValue(), new: this.state$.getValue() }
      ),
      op.filter((delta) => delta.old.status !== delta.new.status),
      op.share(),
    );

    this.#authenticate$.pipe(
      op.filter(() => opt.isSome(this.isUnauthenticated())),
      op.switchMap((message) => {
        const prevState = this.state$.getValue();
        this.state$.next({ status: 'authenticating', user: null });

        // send log-in
        this._connection.send(message);

        // wait for response
        return race(
          timer(5000).pipe(op.tap(() => this.state$.next(prevState))),
          authenticated$,
          unauthenticated$,
        );
      }),
    ).subscribe(() => {});

    // set & unset local storage auth
    _connection
      .messageOf$(InvalidAuthTokenBroadcast)
      .subscribe(message => {
        const rememberToken = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (rememberToken === message.dto.invalidTokenId) {
          localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
        }
      })

    // set & unset local storage auth
    _connection
      .messageOf$(AuthenticatedBroadcast)
      .subscribe(message => {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, message.dto.token.id);
      });

    this.authenticated$ = authenticated$;
    this.unauthenticated$ = unauthenticated$;
    this.delta$ = delta$;
  }

  /**
   * @description
   * Attempt to log in
   *
   * @param arg
   */
  signUp(message: SignupCommand) { this.#authenticate$.next(message); }

  /**
   * @description
   * Attempt to log in
   *
   * @param arg
   */
  login(message: loginCmo) { this.#authenticate$.next(message); }

  /**
   * @description
   * Log out
   *
   * @param arg
   */
  logout(message: LogoutCommand) { this._connection.send(message); }

  /**
   * @description
   * Are we authenticated?
   */
  isAuthenticated(): opt.Option<AuthenticatedState> {
    const state = this.state$.getValue();
    if (state.status === 'authenticated') return opt.some(state);
    return opt.none;
  }

  /**
   * @description
   * Are we authenticated?
   */
  static isAuthenticated(state: AuthState): state is AuthenticatingState { return state.status === 'authenticated'; }

  /**
   * @description
   * Are we authenticated?
   */
  isAuthenticating(): opt.Option<AuthenticatingState> {
    const state = this.state$.getValue();
    if (state.status === 'authenticating') return opt.some(state);
    return opt.none;
  }

  /**
   * @description
   * Are we authenticated?
   */
  static isAuthenticating(state: AuthState): state is AuthenticatingState { return state.status === 'authenticating'; }

  /**
   * @description
   * Are we authenticated?
   */
  isUnauthenticated(): opt.Option<UnauthenticatedState> {
    const state = this.state$.getValue();
    if (state.status === 'unauthenticated') return opt.some(state);
    return opt.none;
  }

  /**
   * @description
   * Are we authenticated?
   */
  static isUnauthenticated(state: AuthState): state is UnauthenticatedState { return state.status === 'unauthenticated'; }
}