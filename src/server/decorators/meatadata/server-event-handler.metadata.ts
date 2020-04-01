import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./metadata-key";
import { IEvent } from "../../../shared/interfaces/interface.event";

export class ServerEventHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.SERVER_EVENT_HANDLER;

  constructor(
    readonly ServerEventCtor: ClassType<IEvent>,
    readonly propertyKey: string | symbol,
    readonly descriptor: PropertyDescriptor,
  ) {}
}
