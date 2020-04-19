import { Constructor } from "../../shared/types/constructor.type";
import { BaseMessage } from "../../shared/base/base.message";
import { SCMessageEvent } from "../events/event.sc.message";

export function onlyMessage<M extends BaseMessage>(MCtor: Constructor<M>) {
  return function doFilter(evt: SCMessageEvent<BaseMessage>): evt is SCMessageEvent<M> {
    return evt.message._n === MCtor.name;
  }
}
