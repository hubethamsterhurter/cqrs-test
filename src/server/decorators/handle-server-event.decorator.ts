import Container from "typedi";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { ClassType } from "class-transformer/ClassTransformer";
import { ServerEvent } from "../events/modules/server-event";

export function HandleServerEvent<E extends ServerEvent>(ServerEventCtor: ClassType<E>): MethodDecorator {
  const doHandleServerEvent = function doHandleServerEvent(
    this: any,
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // TODO: cleanup
    const subscription = Container
      .get(ServerEventStream)
      .of(ServerEventCtor)
      .subscribe((evt) => descriptor.value.apply(this, evt));
  }

  return doHandleServerEvent;
}