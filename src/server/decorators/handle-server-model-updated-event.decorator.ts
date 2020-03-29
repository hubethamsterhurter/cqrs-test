import Container from "typedi";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../shared/domains/model";
import { filter } from "rxjs/operators";
import { serverModelUpdatedEventOf } from '../helpers/server-model-event-filter.helper';
import { ServerEventModelUpdated } from "../events/models/server-event.model-updated";

export function HandleServerModelUpdatedEvent<M extends Model>(ModelCtor: ClassType<M>): MethodDecorator {
  const doHandleServerModelEvent = function doHandleServerModelEvent(
    this: any,
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // TODO: cleanup
    const subscription = Container
      .get(ServerEventStream)
      .of(ServerEventModelUpdated)
      .pipe(filter(serverModelUpdatedEventOf(ModelCtor)))
      .subscribe((evt) => descriptor.value.apply(target, evt));
  }

  return doHandleServerModelEvent;
}