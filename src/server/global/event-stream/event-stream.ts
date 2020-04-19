import { Service, Inject } from "typedi";
import { EventBus } from "../event-bus/event-bus";
import { Observable, Subscriber } from "rxjs";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Constructor } from "../../../shared/types/constructor.type";
import { BaseEvent } from "../../base/base.event";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class EventStream {
  /**
   * @constructor
   * 
   * @param _eb
   */
  constructor(@Inject(() => EventBus) private _eb: EventBus) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  /**
   * @description
   * Retrieve an observable listening to all events
   */
  all(): Observable<BaseEvent> {
    const _eb = this._eb;
    const event$ = new Observable(function subscribe(subscriber: Subscriber<BaseEvent>) {
      // somehow map ctor to something I can get off a hashmap
      const evtSubscription = _eb.subscribeAll((evt) => subscriber.next(evt));
      // teardown logic
      subscriber.add(evtSubscription);
    });
    return event$;
  }

  /**
   * @description
   * Retrieve an observable from an event
   * 
   * @param evtType 
   */
  of<E extends BaseEvent>(
    EvtCtor: Constructor<E>
  ): Observable<E> {
    const _eb = this._eb;
    const event$ = new Observable(function subscribe(subscriber: Subscriber<E>) {
      // somehow map ctor to something I can get off a hashmap
      const evtSubscription = _eb.subscribe(EvtCtor, (evt) => subscriber.next(evt));
      // teardown logic
      subscriber.add(evtSubscription);
    });
    return event$;
  }
}
