import { SCMessageSeo } from "../events/models/sc.message-parsed.seo";
import { IMessage } from "../../shared/interfaces/interface.message";
import { Constructor } from "../../shared/types/constructor.type";
import { CtorOf } from "../../shared/helpers/ctor-of";

export function ofClientMessage<M extends IMessage>(MCtor: Constructor<M>) {
  return function doFilter(evt: SCMessageSeo): evt is SCMessageSeo<M> {
    return CtorOf(evt.dto.message) === MCtor;
  }
}
