import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../../shared/domains/model";
import { SERVER_METADATA_KEY } from "./metadata-key";

export class ServerModelDeletedEventHandlerMetadata {
  readonly _t = SERVER_METADATA_KEY.MODEL_DELETED_EVENT_HANDLER;

  constructor(
    readonly ModelCtor: ClassType<Model>,
    readonly propertyKey: string | symbol,
    readonly descriptor: PropertyDescriptor,
  ) {}
}
