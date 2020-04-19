import { Service } from "typedi";
import { Listener } from "../../../shared/types/listener.type";
import { $FIX_ME } from "../../../shared/types/fix-me.type";
import { AppHeartbeatEvent } from "../../events/event.app-heartbeat";
import { $DANGER } from "../../../shared/types/danger.type";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { Constructor } from "../../../shared/types/constructor.type";
import { BaseEvent } from "../../base/base.event";
import { createEvent } from "../../helpers/create-event.helper";
import { CtorOf } from "../../../shared/helpers/ctor-of";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class EventBus {
  private _log = new Logger(this);
  private _listeners: Map<Constructor<BaseEvent>, Listener<BaseEvent>[]> = new Map();
  private _globalListeners: Listener<BaseEvent>[] = [];
  private _heartbeatInterval: NodeJS.Timeout;

  /**
   * @constructor
   */
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    setTimeout(
      () => this.fire(createEvent(AppHeartbeatEvent, {
        at: new Date(),
        trace: new Trace(),
      })),
      5000,
    );
    this._heartbeatInterval = setInterval(
      () => this.fire(createEvent(AppHeartbeatEvent, {
        at: new Date(),
        trace: new Trace(),
      })),
      20000,
    );
  }


  /**
   * @description
   * Fire an event
   * 
   * @param evt 
   */
  async fire(evt: BaseEvent) {
    const Ctor = CtorOf(evt);

    if ((Ctor as $FIX_ME<any>) === Object) {
      throw new TypeError('Event must be a class instance');
    }

    setImmediate(async () => {
      // this._log.info(`Triggering ${this._listeners.get(Ctor)?.length ?? 0} listeners for evt: ${Ctor.name}`);
      try { await Promise.all(this._globalListeners.concat((this._listeners.get(Ctor) || [])).map(ls => ls(evt))); }
      catch(err) { this._log.error(`ERR: Failed firing event listeners. ${err}`, err); }
    });
  }



  /**
   * @description
   * Be notified of all events
   * 
   * @param newGlobalListener 
   */
  subscribeAll(
    newGlobalListener: Listener<BaseEvent>,
  ): { unsubscribe: () => void } {
    this
      ._globalListeners
      .push(newGlobalListener);

    return {
      unsubscribe: () => {
        this._globalListeners = this
          ._globalListeners
          .filter(oldListener => oldListener !== newGlobalListener);
      }
    };
  }


  /**
   * @description
   * Be notified of an event
   * 
   * @param evtType 
   * @param listener 
   */
  subscribe<T extends BaseEvent>(
    EvtCtor: Constructor<T>,
    listener: Listener<T>,
  ): { unsubscribe: () => void } {
    this
      ._listeners
      .set(
        EvtCtor,
        (this._listeners.get(EvtCtor) || []).concat(listener as unknown as $DANGER<Listener<BaseEvent>>)
      );

    return {
      unsubscribe: () => {
        this._listeners.set(EvtCtor, this._listeners.get(EvtCtor)?.filter(ls => ls !== listener) || []);
      }
    };
  }
}