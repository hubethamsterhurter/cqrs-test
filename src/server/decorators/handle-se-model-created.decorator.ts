import { ClassType } from "class-transformer/ClassTransformer";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerModelCreatedEventHandlerMetadata } from "./meatadata/server-model-created-event-handler.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { IModel } from "../../shared/interfaces/interface.model";

const _log = new Logger(HandleSeModelCreated);

export function HandleSeModelCreated(ModelCtor: ClassType<IModel>): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const HandleSeModelCreatedDecorator = function HandleSeModelCreatedDecorator(
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

  return HandleSeModelCreatedDecorator;
}