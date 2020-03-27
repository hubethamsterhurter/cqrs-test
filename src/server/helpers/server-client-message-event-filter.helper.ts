import { ClassType } from "class-transformer/ClassTransformer";
import { ClientMessage } from "../../shared/message-client/modules/client-message-registry";
import { ServerEventSocketClientMessageParsed } from "../events/models/server-event.socket-client.message-parsed";

export function ofClientMessage<M extends ClientMessage>(MCtor: ClassType<M>) {
  return function doFilter(evt: ServerEventSocketClientMessageParsed): evt is ServerEventSocketClientMessageParsed<M> {
    return evt._p.Ctor === MCtor;
  }
}
