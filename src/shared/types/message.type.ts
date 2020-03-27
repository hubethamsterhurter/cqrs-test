import { ClassType } from "class-transformer/ClassTransformer";

export interface MessageType<V, T> {
  readonly _v: V,
  readonly _t: T,
}

export interface MessageCtorType<M extends MessageType<any, any>> extends ClassType<M> {
  readonly _v: M['_v'],
  readonly _t: M['_t'],
}
