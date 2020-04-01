import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerModelDeletedEventHandlerMetadata } from "./meatadata/server-model-deleted-event-handler.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { IModel } from "../../shared/interfaces/interface.model";

const _log = new Logger(HandleSeModelDeleted);

export function HandleSeModelDeleted(ModelCtor: ClassType<IModel>): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const doHandleSeModelDeleted = function doHandleSeModelDeleted(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${target.constructor.name}.${propertyKey.toString()}`);
    Reflect.defineMetadata(
      SERVER_METADATA_KEY.MODEL_DELETED_EVENT_HANDLER,
      new ServerModelDeletedEventHandlerMetadata(
        ModelCtor,
        propertyKey,
        descriptor,
      ),
      target,
      propertyKey,
    );
  }

  return doHandleSeModelDeleted;
}