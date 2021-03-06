import { Model } from "../../shared/domains/model";
import { ServerEventModelCreated } from "../events/models/server-event.model-created";
import { ServerEventModelUpdated } from "../events/models/server-event.model-updated";
import { ServerEventModelDeleted } from "../events/models/server-event.model-deleted";
import { ClassType } from "class-transformer/ClassTransformer";

export function serverModelCreatedEventOf<M extends Model>(MCtor: ClassType<M>) {
  return function doFilter(evt: ServerEventModelCreated): evt is ServerEventModelCreated<M> {
    return evt._p.CTor === MCtor;
  }
}

export function serverModelUpdatedEventOf<M extends Model>(MCtor: ClassType<M>) {
  return function doFilter(evt: ServerEventModelUpdated): evt is ServerEventModelUpdated<M> {
    return evt._p.CTor === MCtor;
  }
}

export function serverModelDeletedEventOf<M extends Model>(MCtor: ClassType<M>) {
  return function doFilter(evt: ServerEventModelDeleted): evt is ServerEventModelDeleted<M> {
    return evt._p.CTor === MCtor;
  }
}