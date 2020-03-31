import { ClassType } from "class-transformer/ClassTransformer";
import { ServerMessageType } from "../../shared/message-server/modules/server-message-type";

export function ofServerMessage<M extends ServerMessageType<any>>(MCtor: ClassType<M>) {
  return function doFilter(message: ServerMessageType<any>): message is M {
    return message.constructor === MCtor;
  }
}
