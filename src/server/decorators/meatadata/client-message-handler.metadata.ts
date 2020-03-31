import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./metadata-key";
import { IMessage } from "../../../shared/interfaces/interface.message";

export class ClientMessageHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.CLIENT_MESSAGE_HANDLER;

  constructor(
    readonly ClientMessageCtor: ClassType<IMessage>,
    // readonly propertyKey: string | symbol,
    // readonly descriptor: PropertyDescriptor,
  ) {}
}
