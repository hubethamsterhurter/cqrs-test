import { Service } from "typedi";
import { Listener } from "../../../shared/types/listener.type";
import { $FIX_ME } from "../../../shared/types/fix-me.type";
import { ClassType } from "class-transformer/ClassTransformer";
import { AppHeartbeatSeo, AppHeartbeatSeDto } from "../../events/models/app-heartbeat.seo";
import { $DANGER } from "../../../shared/types/danger.type";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { Trace } from "../../../shared/helpers/Tracking.helper";
import { IEvent } from "../../../shared/interfaces/interface.event";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerEventBus {
  private _log = new Logger(this);
  private _listeners: Map<ClassType<IEvent>, Listener<IEvent>[]> = new Map();
  private _globalListeners: Listener<IEvent>[] = [];
  private _heartbeatInterval: NodeJS.Timeout;

  /**
   * @constructor
   */
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    setTimeout(
      () => this.fire(new AppHeartbeatSeo({
        dto: new AppHeartbeatSeDto({ at: new Date(), }),
        trace: new Trace(),
      })),
      5000,
    );
    this._heartbeatInterval = setInterval(
      () => this.fire(new AppHeartbeatSeo({
        dto: new AppHeartbeatSeDto({ at: new Date(), }),
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
  async fire(evt: IEvent) {
    const Ctor = evt.constructor as ClassType<IEvent>;

    if ((Ctor as $FIX_ME<any>) === Object) {
      throw new TypeError(`Attempted to fire unserialized event "${evt._n}"`);
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
    newGlobalListener: Listener<IEvent>,
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
  subscribe<T extends IEvent>(
    EvtCtor: ClassType<T>,
    listener: Listener<T>,
  ): { unsubscribe: () => void } {
    this
      ._listeners
      .set(
        EvtCtor,
        (this._listeners.get(EvtCtor) || []).concat(listener as unknown as $DANGER<Listener<IEvent>>)
      );

    return {
      unsubscribe: () => {
        this._listeners.set(EvtCtor, this._listeners.get(EvtCtor)?.filter(ls => ls !== listener) || []);
      }
    };
  }
}