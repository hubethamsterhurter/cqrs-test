import { BehaviorSubject, Subject } from "rxjs";

export class ObservableCollection<T> {
  get all(): T[] { return this.all$.getValue(); }
  readonly all$: BehaviorSubject<T[]>;
  readonly add$: Subject<T> = new Subject();
  readonly remove$: Subject<T> = new Subject();

  /**
   * @constructor
   *
   * @param initial
   */
  constructor(initial: T[] | ObservableCollection<T>) {
    if (Array.isArray(initial)) {
      this.all$ = new BehaviorSubject(initial);
    } else {
      this.all$ = new BehaviorSubject(initial.all);
      this.mirror(initial);
    }

    this.add$.subscribe(added => {
      const prev = this.all$.getValue();
      if (!prev.includes(added)) { this.all$.next(prev.concat(added)); }
    });

    this.remove$.subscribe(removed => {
      const prev = this.all$.getValue();
      if (prev.includes(removed)) { this.all$.next(prev.filter(prevSocket => prevSocket !== removed)); }
    });
  }

  /**
   * @description
   * Add to the collection
   *
   * @param toAdd
   */
  add(toAdd: T): void {
    this.add$.next(toAdd);
  }


  /**
   * @description
   * remove from the collection
   *
   * @param toRemove
   */
  remove(toRemove: T): void {
    this.remove$.next(toRemove);
  }


  /**
   * @description
   * Add and remove when another collection is added to / remove from
   * 
   * @param otherCollection 
   */
  mirror(otherCollection: ObservableCollection<T>) {
    otherCollection.add$.subscribe(added => this.add$.next(added));
    otherCollection.remove$.subscribe(removed => this.remove$.next(removed));
  }
}
