
export interface Listener<T> {
  (evt: T): any;
}
