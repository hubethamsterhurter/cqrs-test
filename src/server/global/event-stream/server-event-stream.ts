import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEvent } from "../../events/modules/server-event";
import { Observable, Subscriber } from "rxjs";
import { ClassType } from "class-transformer/ClassTransformer";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class ServerEventStream {
  /**
   * @constructor
   * 
   * @param _eventBus
   */
  constructor(@Inject(() => ServerEventBus) private _eventBus: ServerEventBus) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Retrieve an observable from an event
   * 
   * @param evtType 
   */
  of<T extends ServerEvent>(
    EvtCtor: ClassType<T>
  ): Observable<T> {
    const evtBus = this._eventBus;
    const event$ = new Observable(function subscribe(subscriber: Subscriber<T>) {
      // somehow map ctor to something I can get off a hashmap
      const evtSubscription = evtBus.subscribe(EvtCtor, (evt) => subscriber.next(evt));
      // teardown logic
      subscriber.add(evtSubscription);
    });
    return event$;
  }
}
