import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerModelUpdatedEventHandlerMetadata } from "./meatadata/server-model-updated-event-handler.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { IModel } from "../../shared/interfaces/interface.model";

const _log = new Logger(HandleSeModelUpdated);

export function HandleSeModelUpdated(ModelCtor: ClassType<IModel>): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const handleSeModelUpdated = function handleSeModelUpdated(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${target.constructor.name}.${propertyKey.toString()}`);
    Reflect.defineMetadata(
      SERVER_METADATA_KEY.MODEL_UPDATED_EVENT_HANDLER,
      new ServerModelUpdatedEventHandlerMetadata(
        ModelCtor,
        propertyKey,
        descriptor,
      ),
      target,
      propertyKey,
    );
  }

  return handleSeModelUpdated;
}