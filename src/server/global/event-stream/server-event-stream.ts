import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { Observable, Subscriber } from "rxjs";
import { ClassType } from "class-transformer/ClassTransformer";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { IEvent } from "../../../shared/interfaces/interface.event";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerEventStream {
  /**
   * @constructor
   * 
   * @param _eb
   */
  constructor(@Inject(() => ServerEventBus) private _eb: ServerEventBus) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  /**
   * @description
   * Retrieve an observable listening to all events
   */
  all(): Observable<IEvent> {
    const _eb = this._eb;
    const event$ = new Observable(function subscribe(subscriber: Subscriber<IEvent>) {
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
  of<T extends IEvent>(
    EvtCtor: ClassType<T>
  ): Observable<T> {
    const _eb = this._eb;
    const event$ = new Observable(function subscribe(subscriber: Subscriber<T>) {
      // somehow map ctor to something I can get off a hashmap
      const evtSubscription = _eb.subscribe(EvtCtor, (evt) => subscriber.next(evt));
      // teardown logic
      subscriber.add(evtSubscription);
    });
    return event$;
  }
}
