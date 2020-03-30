import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEventStream } from "../event-stream/server-event-stream";
import { SCErrorSeo } from "../../events/models/sc.error.seo";
import { SSErrorSeo } from "../../events/models/ss.error.seo";
import { SCMessageMalformedSeo } from "../../events/models/sc.message-errored.seo";
import { SCMessageInvalidSeo } from "../../events/models/sc.message-invalid.seo";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerWatcher {
  private readonly _log = new ClassLogger(this);

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

    // socket client error
    this
      ._es
      .of(SCErrorSeo)
      .subscribe((evt) => { this._log.warn(`ERR EVENT ] "${SCErrorSeo.name}"`, evt._p.err); });

    // socket server error
    this
      ._es
      .of(SSErrorSeo)
      .subscribe((evt) => { this._log.warn(`ERR EVENT ] "${SSErrorSeo.name}"`, evt._p.err); });

    // malformed message event
    this
      ._es
      .of(SCMessageMalformedSeo)
      .subscribe((evt) => { this._log.warn(`MALFORMED CLIENT MESSAGE EVENT ] "${SCMessageMalformedSeo.name}"`, evt._p.err); });

    // invalid message event
    this
      ._es
      .of(SCMessageInvalidSeo)
      .subscribe((evt) => { this._log.warn(`INVALID CLIENT MESSAGE EVENT ] "${SCMessageInvalidSeo.name}"`, evt._p.errs); });
  }
}