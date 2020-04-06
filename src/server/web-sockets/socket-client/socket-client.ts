import ws from 'ws';
import * as op from 'rxjs/operators';
import { autobind } from 'core-decorators';
import { ServerEventBus } from '../../global/event-bus/server-event-bus';
import { WS_EVENT } from '../../constants/ws.event';
import { SCCloseSeo, SCCloseSeDto } from '../../events/models/sc.close.seo';
import { SCErrorSeo, SCErrorSeDto } from '../../events/models/sc.error.seo';
import { SCMessageSeo, SCMessageSeDto } from '../../events/models/sc.message-parsed.seo';
import { SCMessageInvalidSeo, SCMessageInvalidSeDto } from '../../events/models/sc.message-invalid.seo';
import { SCMessageMalformedSeo, SCMessageMalformedSeDto } from '../../events/models/sc.message-errored.seo';
import { SCOpenSeo, SCOpenSeDto } from '../../events/models/sc.open.seo';
import { SCUnexpectedResponseSeo, SCUnexpectedResponseSeDto } from '../../events/models/sc.unexpected-response.seo';
import { SCUpgradeSeo, SCUpgradeSeDto } from '../../events/models/sc.upgrade.seo';
import { SCPongSeo, SCPongSeDto } from '../../events/models/sc.pong.seo';
import { SCPingSeo, SCPingSeDto } from '../../events/models/sc.ping.seo';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { IMessage } from '../../../shared/interfaces/interface.message';
import { MessageParser } from '../../../shared/util/message-parser.util';
import { SCMessageUnhandledSeo, SCMessageUnhandledSeDto } from '../../events/models/sc.message-unhandled.seo';
import { SessionModel } from '../../../shared/domains/session/session.model';
import { UserModel } from '../../../shared/domains/user/user.model';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { ServerEventStream } from '../../global/event-stream/server-event-stream';
import { ModelUpdatedSeo } from '../../events/models/model-updated.seo';
import { ModelDeletedSeo } from '../../events/models/model-deleted.seo';


@LogConstruction()
export class SocketClient {
  private _log = new Logger(this);

  get session(): SessionModel { return this.session$.getValue(); }
  set session(arg: SessionModel) { this.session$.next(arg) }

  get user(): UserModel | null { return this.user$.getValue(); }
  set user(arg: UserModel | null) { this.user$.next(arg) }

  readonly #updatedSub: Subscription;
  readonly #deletedSub: Subscription;

  user$: BehaviorSubject<UserModel | null>;
  session$: BehaviorSubject<SessionModel>;

  close$: Subject<undefined> = new Subject();

  /**
   * @constructor
   *
   * @param id
   * @param _props
   */
  constructor(
    readonly id: string,
    session: SessionModel,
    user: UserModel | null,
    private readonly _parser: MessageParser,
    private readonly _ws: ws,
    private readonly _eb: ServerEventBus,
    private readonly _es: ServerEventStream,
  ) {
    // emissions
    this._ws.on(WS_EVENT.CLOSE, this._handleClose);
    this._ws.on(WS_EVENT.ERROR, this._handleError);
    this._ws.on(WS_EVENT.MESSAGE, this._handleMessage);
    this._ws.on(WS_EVENT.OPEN, this._handleOpen);
    this._ws.on(WS_EVENT.PING, this._handlePing);
    this._ws.on(WS_EVENT.PONG, this._handlePong);
    this._ws.on(WS_EVENT.UGPRADE, this._handleUpgrade);
    this._ws.on(WS_EVENT.UNEXPECTED_RESPONSE, this._handleUnexpectedResponse);

    this.user$ = new BehaviorSubject(user);
    this.session$ = new BehaviorSubject(session);

    // heavy to do this on for every connection TODO: mediator pattern
    this.#updatedSub = this
      ._es
      .of(ModelUpdatedSeo)
      .pipe(
        op.takeWhile(() => !!this.user$.getValue()),
        op.filter((evt) =>
          ((evt.dto.model instanceof UserModel) && (evt.dto.model.id === this.user?.id))
          || ((evt.dto.model instanceof SessionModel) && (evt.dto.model.id === this.session?.id))
          ),
      )
      .subscribe((evt) => {
        if (evt.dto.model instanceof UserModel) { this.user$.next(evt.dto.model); }
        if (evt.dto.model instanceof SessionModel) { this.session$.next(evt.dto.model); }
      });

    // heavy to do this on for every connection TODO: mediator pattern
    this.#deletedSub = this
      ._es
      .of(ModelDeletedSeo)
      .pipe(
        op.takeWhile(() => !!this.user$.getValue()),
        op.filter((evt) =>
          ((evt.dto.model instanceof UserModel) && (evt.dto.model.id === this.user?.id))
          || ((evt.dto.model instanceof SessionModel) && (evt.dto.model.id === this.session?.id))
          ),
      )
      .subscribe((evt) => {
        if (evt.dto.model instanceof UserModel) { this.user$.next(evt.dto.model); }
        if (evt.dto.model instanceof SessionModel) { this.session$.next(evt.dto.model); }
      })
  }



  /**
   * @description
   * Handle closing of a socket
   *
   * @param code
   * @param reason
   */
  @autobind
  private async _handleClose(code: number, reason: string) {
    this._eb.fire(new SCCloseSeo({
      dto: new SCCloseSeDto({
        socket: this,
        code,
        reason,
      }),
      trace: new Trace(),
    }));
    this.close$.next();
    this._ws.off(WS_EVENT.CLOSE, this._handleClose);
    this._ws.off(WS_EVENT.ERROR, this._handleError);
    this._ws.off(WS_EVENT.MESSAGE, this._handleMessage);
    this._ws.off(WS_EVENT.OPEN, this._handleOpen);
    this._ws.off(WS_EVENT.PING, this._handlePing);
    this._ws.off(WS_EVENT.PONG, this._handlePong);
    this._ws.off(WS_EVENT.UGPRADE, this._handleUpgrade);
    this._ws.off(WS_EVENT.UNEXPECTED_RESPONSE, this._handleUnexpectedResponse);
    this.#updatedSub.unsubscribe();
    this.#deletedSub.unsubscribe();
    this.user$.unsubscribe();
    this.session$.unsubscribe();
    this.close$.unsubscribe();
  }



  /**
   * @description
   * Fired when the socket has an error
   *
   * @param error
   */
  @autobind
  private async _handleError(error: Error) {
    this._eb.fire(new SCErrorSeo({
      dto: new SCErrorSeDto({
        socket: this,
        err: error,
      }),
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when a message is received
   *
   * @param data
   */
  @autobind
  private async _handleMessage(data: ws.Data) {
    const result = this._parser.fromString(data.toString());

    if (result.malformed()) {
      // message -> malformed
      this._eb.fire(new SCMessageMalformedSeo({
        dto: new SCMessageMalformedSeDto({
          socket: this,
          err: result._u.err,
        }),
        trace: new Trace(),
      }));
    }

    else if (result.invalid()) {
      // message -> invalid
      this._eb.fire(new SCMessageInvalidSeo({
        dto: new SCMessageInvalidSeDto({
          socket: this,
          errs: result._u.errs,
          MessageCtor: result._u.Ctor,
        }),
        trace: result._u.trace?.clone() ?? new Trace(),
      }));
    }

    else if (result.success()) {
      // message -> success

      this._eb.fire(new SCMessageSeo({
        dto: new SCMessageSeDto({
          socket: this,
          message: result._u.instance,
        }),
        trace: result._u.instance.trace.clone(),
      }));
    }

    else if (result.unhandled()) {
      // message -> success

      this._eb.fire(new SCMessageUnhandledSeo({
        dto: new SCMessageUnhandledSeDto({
          socket: this,
          message: result._u.raw,
        }),
        trace: new Trace(),
      }));
    }
  }



  /**
   * @description
   * Fired when a connection is opened
   */
  @autobind
  private async _handleOpen() {
    this._eb.fire(new SCOpenSeo({
      dto: new SCOpenSeDto({
        socket: this,
      }),
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when a ping is received
   */
  @autobind
  private async _handlePing() {
    this._eb.fire(new SCPingSeo({
      dto: new SCPingSeDto({
        socket: this,
      }),
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when a pong is received
   */
  @autobind
  private async _handlePong() {
    this._eb.fire(new SCPongSeo({
      dto: new SCPongSeDto({
        socket: this,
      }),
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when the connection is upgraded
   */
  @autobind
  private async _handleUpgrade() {
      this._eb.fire(new SCUpgradeSeo({
      dto: new SCUpgradeSeDto({
        socket: this,
      }),
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when an unexpected response is received from the socket
   */
  @autobind
  private async _handleUnexpectedResponse() {
    this._eb.fire(new SCUnexpectedResponseSeo({
      dto: new SCUnexpectedResponseSeDto({
        socket: this,
      }),
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Send a message to the client
   *
   * @param msg 
   */
  send(msg: IMessage) {
    const strMsg = JSON.stringify(msg);
    this._log.info(`\t->\t SENDING MESSAGE \t -> \t ${msg?.constructor?.name?.padEnd(25, ' ')} \t -> \t ${msg?.trace?.origin_id}`);
    this._ws.send(strMsg);
  }
}
