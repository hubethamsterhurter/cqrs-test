import Container from "typedi";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { ServerEventSocketClientMessageParsed } from "../events/models/server-event.socket-client.message-parsed";
import { ofClientMessage } from "../helpers/server-client-message-event-filter.helper";
import { filter } from "rxjs/operators";
import { ClientMessage } from "../../shared/message-client/modules/client-message-registry";
import { ClassType } from "class-transformer/ClassTransformer";

export function HandleClientMessage<M extends ClientMessage>(MessageCtor: ClassType<M>): MethodDecorator {
  const doHandleClientMessage = function doHandleClientMessage(
    this: any,
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // TODO: cleanup
    const subscription = Container
      .get(ServerEventStream)
      .of(ServerEventSocketClientMessageParsed)
      .pipe(filter(ofClientMessage(MessageCtor)))
      .subscribe((evt) => (descriptor.value as Function).call(target, evt));
  }

  return doHandleClientMessage;
}