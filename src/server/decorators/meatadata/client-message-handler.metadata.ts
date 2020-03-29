import { ClientMessage } from "../../../shared/message-client/modules/client-message-registry";
import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./metadata-key";

export class ClientMessageHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.CLIENT_MESSAGE_HANDLER;

  constructor(
    readonly ClientMessageCtor: ClassType<ClientMessage>,
    readonly propertyKey: string | symbol,
    readonly descriptor: PropertyDescriptor,
  ) {}
}
