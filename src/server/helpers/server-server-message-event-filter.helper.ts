import { ClassType } from "class-transformer/ClassTransformer";
import { ServerMessage } from "../../shared/message-server/modules/server-message-registry";

export function ofServerMessage<M extends ServerMessage>(MCtor: ClassType<M>) {
  return function doFilter(message: ServerMessage): message is M {
    return message.constructor === MCtor;
  }
}
