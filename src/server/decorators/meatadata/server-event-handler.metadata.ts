import { ServerEvent } from "../../events/modules/server-event";
import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./metadata-key";

export class ServerEventHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.SERVER_EVENT_HANDLER;

  constructor(
    readonly ServerEventCtor: ClassType<ServerEvent>,
    readonly propertyKey: string | symbol,
    readonly descriptor: PropertyDescriptor,
  ) {}
}
