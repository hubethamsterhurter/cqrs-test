import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../../shared/domains/model";
import { SERVER_METADATA_KEY } from "./metadata-key";

export class ServerModelUpdatedEventHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.MODEL_UPDATED_EVENT_HANDLER;

  constructor(
    readonly ModelCtor: ClassType<Model>,
    readonly propertyKey: string | symbol,
    readonly descriptor: PropertyDescriptor,
  ) {}
}
