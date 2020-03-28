import Container from "typedi";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../shared/domains/model";
import { filter } from "rxjs/operators";
import { serverModelDeletedEventOf } from '../helpers/server-model-event-filter.helper';
import { ServerEventModelDeleted } from "../events/models/server-event.model-deleted";

export function HandleServerModelDeletedEvent<M extends Model>(ModelCtor: ClassType<M>): MethodDecorator {
  const doHandleServerModelEvent = function doHandleServerModelEvent(
    this: any,
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // TODO: cleanup
    const subscription = Container
      .get(ServerEventStream)
      .of(ServerEventModelDeleted)
      .pipe(filter(serverModelDeletedEventOf(ModelCtor)))
      .subscribe((evt) => descriptor.value.apply(this, evt));
  }

  return doHandleServerModelEvent;
}