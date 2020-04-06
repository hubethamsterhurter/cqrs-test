import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEventStream } from "../event-stream/server-event-stream";
import { SCErrorSeo } from "../../events/models/sc.error.seo";
import { SCMessageMalformedSeo } from "../../events/models/sc.message-errored.seo";
import { SCMessageInvalidSeo } from "../../events/models/sc.message-invalid.seo";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { AppHeartbeatSeo } from "../../events/models/app-heartbeat.seo";
import { SSListeningSeo } from '../../events/models/ss.listening.seo';
import { SCMessageSeo } from '../../events/models/sc.message-parsed.seo';
import { ctorName } from '../../../shared/helpers/ctor-name.helper';
import { SeConsumer } from '../../decorators/se-consumer.decorator';
import { SubscribeEvent } from '../../decorators/subscribe-event.decorator';
import { SCMessageUnhandledSeo } from '../../events/models/sc.message-unhandled.seo';

let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
export class ServerWatcher {
  private readonly _log = new Logger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => ServerEventBus) private readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
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
  @SubscribeEvent(SCErrorSeo)
  onSocketError(evt: SCErrorSeo) {
    this._log.warn(`Error event ] "${SCErrorSeo.name}"`, evt.dto.err);
  }

  /**
   * @description
   * Fired when a message is detected as malformed
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageMalformedSeo)
  onMessageMalformed(evt: SCMessageMalformedSeo) {
    this._log.warn(`Detected malformed message ] "${SCMessageMalformedSeo.name}"`, evt.dto.err);
  }

  /**
   * @description
   * Fired when a message is invalid
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageInvalidSeo)
  onMessageInvalid(evt: SCMessageInvalidSeo) {
    this._log.warn(`Detected invalid message ] "${SCMessageInvalidSeo.name}"`, evt.dto.errs);
  }

  /**
   * @description
   * Fired when a message is unhandled
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageUnhandledSeo)
  onMessageUhandled (evt: SCMessageUnhandledSeo) {
    this._log.warn(`Detected unhandled message ] "${SCMessageInvalidSeo.name}"`, evt.dto.message);
  }

  /**
   * @description
   * Fired when a socket message is parsed
   * 
   * @param evt 
   */
  @SubscribeEvent(SCMessageSeo)
  onMessage(evt: SCMessageSeo) {
    this._log.info(`Detected message ] ${ctorName(evt.dto.message)}`);
  }

  /**
   * @description
   * Fired on app heartbeat
   *
   * @param evt
   */
  @SubscribeEvent(AppHeartbeatSeo)
  onAppHeartbeat(evt: AppHeartbeatSeo) {
    this._log.info('Heartbeat ]', evt.dto.at);
  }

  /**
   * @description
   * Fired when the socket server starts listening
   *
   * @param evt
   */
  @SubscribeEvent(SSListeningSeo)
  onSocketServerListening(evt: SSListeningSeo) {
    this._log.info('Socket Server listening ]');
  }
}