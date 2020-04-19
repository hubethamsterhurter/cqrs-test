import { Service, Inject } from "typedi";
import { EventBus } from "../event-bus/event-bus";
import { EventStream } from "../event-stream/event-stream";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { ctorName } from '../../../shared/helpers/ctor-name.helper';
import { EventStation } from '../../decorators/event-station.decorator';
import { SubscribeEvent } from '../../decorators/subscribe-event.decorator';
import { SCErrorEvent } from "../../events/event.sc.error";
import { SCMessageMalformedEvent } from "../../events/event.sc.message-errored";
import { SCMessageInvalidEvent } from "../../events/event.sc.message-invalid";
import { SCMessageUnhandledEvent } from "../../events/event.sc.message-unhandled";
import { SCMessageEvent } from "../../events/event.sc.message";
import { AppHeartbeatEvent } from "../../events/event.app-heartbeat";
import { SSListeningEvent } from "../../events/event.ss.listening";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
@EventStation()
export class ServerWatcher {
  private readonly _log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => EventBus) private readonly _eb: EventBus,
    @Inject(() => EventStream) private readonly _es: EventStream,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    this._es.all().subscribe((evt) => {
      this
        ._log
        .info(`\t->\t EVENT           \t -> \t ${evt.constructor.name.padEnd(25, ' ')} \t -> \t ${evt.trace.origin_id}`);
    });
  }

  /**
   * @description
   * Fired on socket client error
   *
   * @param evt
   */
  @SubscribeEvent(SCErrorEvent)
  onSocketError(evt: SCErrorEvent) {
    this._log.warn(`Error event ] "${SCErrorEvent.name}"`, evt.err);
  }

  /**
   * @description
   * Fired when a message is detected as malformed
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageMalformedEvent)
  onMessageMalformed(evt: SCMessageMalformedEvent) {
    this._log.warn(`Detected malformed message ] "${SCMessageMalformedEvent.name}"`, evt.err);
  }

  /**
   * @description
   * Fired when a message is invalid
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageInvalidEvent)
  onMessageInvalid(evt: SCMessageInvalidEvent) {
    this._log.warn(`Detected invalid message ] "${SCMessageInvalidEvent.name}"`, evt.errs);
  }

  /**
   * @description
   * Fired when a message is unhandled
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageUnhandledEvent)
  onMessageUhandled (evt: SCMessageUnhandledEvent) {
    this._log.warn(`Detected unhandled message ] "${SCMessageUnhandledEvent.name}"`, evt.message);
  }

  /**
   * @description
   * Fired when a socket message is parsed
   * 
   * @param evt 
   */
  @SubscribeEvent(SCMessageEvent)
  onMessage(evt: SCMessageEvent) {
    this._log.info(`Detected message ] ${ctorName(evt.message)}`);
  }

  /**
   * @description
   * Fired on app heartbeat
   *
   * @param evt
   */
  @SubscribeEvent(AppHeartbeatEvent)
  onAppHeartbeat(evt: AppHeartbeatEvent) {
    this._log.info('Heartbeat ]', evt.at);
  }

  /**
   * @description
   * Fired when the socket server starts listening
   *
   * @param evt
   */
  @SubscribeEvent(SSListeningEvent)
  onSocketServerListening(evt: SSListeningEvent) {
    this._log.info('Socket Server listening ]');
  }
}