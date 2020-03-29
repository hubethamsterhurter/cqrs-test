import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../../shared/domains/model";
import { SERVER_METADATA_KEY } from "./metadata-key";

export class ServerModelCreatedEventHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.MODEL_CREATED_EVENT_HANDLER;

  constructor(
    readonly ModelCtor: ClassType<Model>,
    readonly propertyKey: string | symbol,
    readonly descriptor: PropertyDescriptor,
  ) {}
}
