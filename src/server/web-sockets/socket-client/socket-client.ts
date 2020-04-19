import ws from 'ws';
import * as op from 'rxjs/operators';
import { autobind } from 'core-decorators';
import { EventBus } from '../../global/event-bus/event-bus';
import { WS_EVENT } from '../../constants/ws.event';
import { SCCloseEvent } from '../../events/event.sc.close';
import { SCErrorEvent } from '../../events/event.sc.error';
import { SCOpenEvent } from '../../events/event.sc.open';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { Trace } from '../../../shared/helpers/Tracking.helper';
import { MessageParser } from '../../../shared/util/message-parser.util';
import { SCMessageUnhandledEvent } from '../../events/event.sc.message-unhandled';
import { UserModel } from '../../domains/user/user.model';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { EventStream } from '../../global/event-stream/event-stream';
import { BaseMessage } from '../../../shared/base/base.message';
import { SessionModel } from '../../domains/session/session.model';
import { ModelUpdatedEvent } from '../../events/event.model-updated';
import { ModelDeletedEvent } from '../../events/event.model-deleted';
import { createEvent } from '../../helpers/create-event.helper';
import { SCMessageMalformedEvent } from '../../events/event.sc.message-errored';
import { SCMessageInvalidEvent } from '../../events/event.sc.message-invalid';
import { SCMessageEvent } from '../../events/event.sc.message';
import { SCPingEvent } from '../../events/event.sc.ping';
import { SCPongEvent } from '../../events/event.sc.pong';
import { SCUpgradeEvent } from '../../events/event.sc.upgrade';
import { SCUnexpectedResponseEvent } from '../../events/event.sc.unexpected-response';


@LogConstruction()
export class SocketClient {
  readonly #log = new Logger(this);

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
    private readonly _eb: EventBus,
    private readonly _es: EventStream,
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
      .of(ModelUpdatedEvent)
      .pipe(
        op.takeWhile(() => !!this.user$.getValue()),
        op.filter((evt) =>
          ((evt.model instanceof UserModel) && (evt.model.id === this.user?.id))
          || ((evt.model instanceof SessionModel) && (evt.model.id === this.session?.id))
          ),
      )
      .subscribe((evt) => {
        if (evt.model instanceof UserModel) { this.user$.next(evt.model); }
        if (evt.model instanceof SessionModel) { this.session$.next(evt.model); }
      });

    // heavy to do this on for every connection TODO: mediator pattern
    this.#deletedSub = this
      ._es
      .of(ModelDeletedEvent)
      .pipe(
        op.takeWhile(() => !!this.user$.getValue()),
        op.filter((evt) =>
          ((evt.model instanceof UserModel) && (evt.model.id === this.user?.id))
          || ((evt.model instanceof SessionModel) && (evt.model.id === this.session?.id))
          ),
      )
      .subscribe((evt) => {
        if (evt.model instanceof UserModel) { this.user$.next(evt.model); }
        if (evt.model instanceof SessionModel) { this.session$.next(evt.model); }
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
    this._eb.fire(createEvent(SCCloseEvent, {
      socket: this,
      code,
      reason,
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
    this._eb.fire(createEvent(SCErrorEvent, {
      socket: this,
      err: error,
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
      this._eb.fire(createEvent(SCMessageMalformedEvent, {
        socket: this,
        err: result._u.err,
        trace: new Trace(),
      }));
    }

    else if (result.invalid()) {
      // message -> invalid
      this._eb.fire(createEvent(SCMessageInvalidEvent, {
        socket: this,
        errs: result._u.errs,
        MessageCtor: result._u.Ctor,
        trace: result._u.trace?.clone() ?? new Trace(),
      }));
    }

    else if (result.success()) {
      // message -> success

      this._eb.fire(createEvent(SCMessageEvent, {
        socket: this,
        message: result._u.instance,
        trace: result._u.instance.trace.clone(),
      }));
    }

    else if (result.unhandled()) {
      // message -> success

      this._eb.fire(createEvent(SCMessageUnhandledEvent, {
        socket: this,
        message: result._u.raw,
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
    this._eb.fire(createEvent(SCOpenEvent, {
      socket: this,
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when a ping is received
   */
  @autobind
  private async _handlePing() {
    this._eb.fire(createEvent(SCPingEvent, {
      socket: this,
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when a pong is received
   */
  @autobind
  private async _handlePong() {
    this._eb.fire(createEvent(SCPongEvent, {
      socket: this,
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when the connection is upgraded
   */
  @autobind
  private async _handleUpgrade() {
      this._eb.fire(createEvent(SCUpgradeEvent, {
      socket: this,
      trace: new Trace(),
    }));
  }



  /**
   * @description
   * Fired when an unexpected response is received from the socket
   */
  @autobind
  private async _handleUnexpectedResponse() {
    this._eb.fire(createEvent(SCUnexpectedResponseEvent, {
      socket: this,
      trace: new Trace(),
    }));
  }


  /**
   * @description
   * Send a message to the client
   *
   * @param msg
   */
  send(message: BaseMessage) {
    // wrap
    this.#log.message(message);
    const strMsg = JSON.stringify(message);
    return this.sendRaw(strMsg);
  }


  /**
   * @description
   * Send a message to the client
   *
   * @param msg 
   */
  sendRaw(msg: string) {
    this._ws.send(msg);
  }
}
