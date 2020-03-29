import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEventStream } from "../event-stream/server-event-stream";
import { ServerEventSocketClientError } from "../../events/models/server-event.socket-client.error";
import { ServerEventSocketServerError } from "../../events/models/server-event.socket-server.error";
import { ServerEventSocketClientMessageMalformed } from "../../events/models/server-event.socket-client.message-errored";
import { ServerEventSocketClientMessageInvalid } from "../../events/models/server-event.socket-client.message-invalid";
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
      .of(ServerEventSocketClientError)
      .subscribe((evt) => { this._log.warn(`ERR EVENT ] "${ServerEventSocketClientError.name}"`, evt._p.err); });

    // socket server error
    this
      ._es
      .of(ServerEventSocketServerError)
      .subscribe((evt) => { this._log.warn(`ERR EVENT ] "${ServerEventSocketServerError.name}"`, evt._p.err); });

    // malformed message event
    this
      ._es
      .of(ServerEventSocketClientMessageMalformed)
      .subscribe((evt) => { this._log.warn(`MALFORMED CLIENT MESSAGE EVENT ] "${ServerEventSocketClientMessageMalformed.name}"`, evt._p.err); });

    // invalid message event
    this
      ._es
      .of(ServerEventSocketClientMessageInvalid)
      .subscribe((evt) => { this._log.warn(`INVALID CLIENT MESSAGE EVENT ] "${ServerEventSocketClientMessageInvalid.name}"`, evt._p.errs); });
  }
}