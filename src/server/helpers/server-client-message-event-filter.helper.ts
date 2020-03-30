import { ClassType } from "class-transformer/ClassTransformer";
import { ClientMessage } from "../../shared/message-client/modules/client-message-registry";
import { SocketClientMessageParsedSeo } from "../events/models/socket-client.message-parsed.seo";

export function ofClientMessage<M extends ClientMessage>(MCtor: ClassType<M>) {
  return function doFilter(evt: SocketClientMessageParsedSeo): evt is SocketClientMessageParsedSeo<M> {
    return evt._p.Ctor === MCtor;
  }
}
