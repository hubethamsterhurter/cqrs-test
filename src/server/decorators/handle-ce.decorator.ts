// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ServerEventHandlerMetadata } from "./meatadata/server-event-handler.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { IEvent } from "../../shared/interfaces/interface.event";
import { ClassType } from "class-transformer/ClassTransformer";

const _log = new Logger(HandleSe);

export function HandleSe(ServerEventCtor: ClassType<IEvent>): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const HandleSeDecorator: MethodDecorator = function HandleSeDecorator(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${target.constructor.name}.${propertyKey.toString()}`);
    Reflect.defineMetadata(
      SERVER_METADATA_KEY.SERVER_EVENT_HANDLER,
      new ServerEventHandlerMetadata(
        ServerEventCtor,
        propertyKey,
        descriptor,
      ),
      target,
      propertyKey,
    );
  }

  return HandleSeDecorator;
}