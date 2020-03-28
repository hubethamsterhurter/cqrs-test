import Container from "typedi";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../shared/domains/model";
import { ServerEventModelCreated } from "../events/models/server-event.model-created";
import { filter } from "rxjs/operators";
import { serverModelCreatedEventOf } from '../helpers/server-model-event-filter.helper';

export function HandleServerModelCreatedEvent<M extends Model>(ModelCtor: ClassType<M>): MethodDecorator {
  const doHandleServerModelEvent = function doHandleServerModelEvent(
    this: any,
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // TODO: cleanup
    const subscription = Container
      .get(ServerEventStream)
      .of(ServerEventModelCreated)
      .pipe(filter(serverModelCreatedEventOf(ModelCtor)))
      .subscribe((evt) => descriptor.value.apply(this, evt));
  }

  return doHandleServerModelEvent;
}