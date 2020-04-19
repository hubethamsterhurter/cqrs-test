import { BaseModel } from "../base/base.model";
import { Constructor } from "../../shared/types/constructor.type";
import { ModelCreatedEvent } from "../events/event.model-created";
import { ModelUpdatedEvent } from "../events/event.model-updated";
import { ModelDeletedEvent } from "../events/event.model-deleted";

export function onlyCreatedModel<M extends BaseModel>(MCtor: Constructor<M>) {
  return function doFilter(evt: ModelCreatedEvent): evt is ModelCreatedEvent<M> {
    return evt.CtorName === MCtor.name;
  }
}

export function onlyUpdatedModel<M extends BaseModel>(MCtor: Constructor<M>) {
  return function doFilter(evt: ModelUpdatedEvent): evt is ModelUpdatedEvent<M> {
    return evt.ctorName === MCtor.name;
  }
}

export function onlyDeletedModel<M extends BaseModel>(MCtor: Constructor<M>) {
  return function doFilter(evt: ModelDeletedEvent): evt is ModelDeletedEvent<M> {
    return evt.CtorName === MCtor.name;
  }
}