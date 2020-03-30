import { ClassType } from "class-transformer/ClassTransformer";
import { ClientMessage } from "../../shared/message-client/modules/client-message-registry";
import { SCMessageSeo } from "../events/models/sc.message-parsed.seo";

export function ofClientMessage<M extends ClientMessage>(MCtor: ClassType<M>) {
  return function doFilter(evt: SCMessageSeo): evt is SCMessageSeo<M> {
    return evt._p.Ctor === MCtor;
  }
}
