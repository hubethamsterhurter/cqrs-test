import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../shared/domains/model";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerModelCreatedEventHandlerMetadata } from "./meatadata/server-model-created-event-handler.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";

const _log = new Logger(HandleSeModelCreated);

export function HandleSeModelCreated<M extends Model>(ModelCtor: ClassType<M>): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const doHandleSeModelCreated = function doHandleSeModelCreated(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${target.constructor.name}.${propertyKey.toString()}`);
    Reflect.defineMetadata(
      SERVER_METADATA_KEY.MODEL_CREATED_EVENT_HANDLER,
      new ServerModelCreatedEventHandlerMetadata(
        ModelCtor,
        propertyKey,
        descriptor,
      ),
      target,
      propertyKey,
    );
  }

  return doHandleSeModelCreated;
}