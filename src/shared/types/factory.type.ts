import { MaybePromise } from "./maybe-promise.type";

export interface Factory<T, P = undefined> {
  create(using: P): MaybePromise<T>;
}