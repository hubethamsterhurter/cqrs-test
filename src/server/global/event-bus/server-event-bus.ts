import { Service } from "typedi";
import { Listener } from "../../../shared/types/listener.type";
import { ServerEvent } from '../../events/modules/server-event'
import { $FIX_ME } from "../../../shared/types/fix-me.type";
import { ClassType } from "class-transformer/ClassTransformer";
import { ServerEventAppHeartbeat } from "../../events/models/server-event.app-heartbeat";
import { $DANGER } from "../../../shared/types/danger.type";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { Trace } from "../../../shared/helpers/Tracking.helper";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerEventBus {
  private _log = new ClassLogger(this);
  private _listeners: Map<ClassType<ServerEvent>, Listener<ServerEvent>[]> = new Map();
  private _heartbeatInterval: NodeJS.Timeout;

  /**
   * @constructor
   */
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    setTimeout(
      () => this.fire(new ServerEventAppHeartbeat({ _p: { at: new Date(), }, _o: new Trace(), })),
      5000,
    );
    this._heartbeatInterval = setInterval(
      () => this.fire(new ServerEventAppHeartbeat({ _p: { at: new Date(), }, _o: new Trace(), })),
      20000,
    );
  }


  /**
   * @description
   * Fire an event
   * 
   * @param evt 
   */
  async fire(evt: ServerEvent) {
    const Ctor = evt.constructor as ClassType<ServerEvent>;

    if ((Ctor as $FIX_ME<any>) === Object) {
      throw new TypeError(`Attempted to fire unserialized event "${evt._t}"`);
    }

    setImmediate(async () => {
      // this._log.info(`Triggering ${this._listeners.get(Ctor)?.length ?? 0} listeners for evt: ${Ctor.name}`);
      try { await Promise.all((this._listeners.get(Ctor) || []).map(ls => ls(evt))); }
      catch(err) { this._log.error(`ERR: Failed firing event listeners. ${err}`, err); }
    });
  }


  /**
   * @description
   * Be notified of an event
   * 
   * @param evtType 
   * @param listener 
   */
  subscribe<T extends ServerEvent>(
    EvtCtor: ClassType<T>,
    listener: Listener<T>
  ): { unsubscribe: () => void } {
    this
      ._listeners
      .set(
        EvtCtor,
        (this._listeners.get(EvtCtor) || []).concat(listener as unknown as $DANGER<Listener<ServerEvent>>)
      );

    return {
      unsubscribe: () => {
        this._listeners.set(EvtCtor, this._listeners.get(EvtCtor)?.filter(ls => ls !== listener) || []);
      }
    };
  }
}