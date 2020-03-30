import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEventStream } from "../event-stream/server-event-stream";
import { SocketClientErrorSeo } from "../../events/models/socket-client.error.seo";
import { SocketServerErrorSeo } from "../../events/models/socket-server.error.seo";
import { SocketClientMessageMalformedSeo } from "../../events/models/socket-client.message-errored.seo";
import { SocketClientMessageInvalidSeo } from "../../events/models/socket-client.message-invalid.seo";
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
      .of(SocketClientErrorSeo)
      .subscribe((evt) => { this._log.warn(`ERR EVENT ] "${SocketClientErrorSeo.name}"`, evt._p.err); });

    // socket server error
    this
      ._es
      .of(SocketServerErrorSeo)
      .subscribe((evt) => { this._log.warn(`ERR EVENT ] "${SocketServerErrorSeo.name}"`, evt._p.err); });

    // malformed message event
    this
      ._es
      .of(SocketClientMessageMalformedSeo)
      .subscribe((evt) => { this._log.warn(`MALFORMED CLIENT MESSAGE EVENT ] "${SocketClientMessageMalformedSeo.name}"`, evt._p.err); });

    // invalid message event
    this
      ._es
      .of(SocketClientMessageInvalidSeo)
      .subscribe((evt) => { this._log.warn(`INVALID CLIENT MESSAGE EVENT ] "${SocketClientMessageInvalidSeo.name}"`, evt._p.errs); });
  }
}