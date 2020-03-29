import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../shared/domains/model";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerModelUpdatedEventHandlerMetadata } from "./meatadata/server-model-updated-event-handler.metadata";
import { ClassLogger } from "../../shared/helpers/class-logger.helper";

const _log = new ClassLogger(HandleServerModelUpdatedEvent);

export function HandleServerModelUpdatedEvent<M extends Model>(ModelCtor: ClassType<M>): MethodDecorator {
  const doHandleServerModelEvent = function doHandleServerModelEvent(
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

    // const subscription = Container
    //   .get(ServerEventStream)
    //   .of(ServerEventModelUpdated)
    //   .pipe(filter(serverModelUpdatedEventOf(ModelCtor)))
    //   .subscribe((evt) => descriptor.value.apply(this, evt));
  }

  return doHandleServerModelEvent;
}