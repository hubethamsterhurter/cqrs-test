import { ClassType } from "class-transformer/ClassTransformer";
import { Model } from "../../shared/domains/model";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerModelDeletedEventHandlerMetadata } from "./meatadata/server-model-deleted-event-handler.metadata";
import { ClassLogger } from "../../shared/helpers/class-logger.helper";

const _log = new ClassLogger(HandleServerModelDeletedEvent);

export function HandleServerModelDeletedEvent<M extends Model>(ModelCtor: ClassType<M>): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const doHandleServerModelEvent = function doHandleServerModelEvent(
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

    // const subscription = Container
    //   .get(ServerEventStream)
    //   .of(ServerEventModelDeleted)
    //   .pipe(filter(serverModelDeletedEventOf(ModelCtor)))
    //   .subscribe((evt) => descriptor.value.apply(this, evt));
  }

  return doHandleServerModelEvent;
}