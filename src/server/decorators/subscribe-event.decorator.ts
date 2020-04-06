// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SeHandlerMetadata } from "../global/metadata-container/metadata/se.handler.method.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { IEvent } from "../../shared/interfaces/interface.event";
import { ClassType } from "class-transformer/ClassTransformer";
import Container from "typedi";
import { ServerMetadataContainer } from "../global/metadata-container/server-metadata-container";
import { Constructor } from "../../shared/types/constructor.type";
import { Prototype } from "../../shared/types/prototype.type";

const _log = new Logger(SubscribeEvent);

export function SubscribeEvent(SeCtor: ClassType<IEvent>): MethodDecorator {
  /**
   * @decorator
   *
   * @param prototype       prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const handleSubscribedEvent: MethodDecorator = function handleSubscribedEvent(
    prototype: Object | Function,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${prototype.constructor.name}.${propertyKey.toString()}`);

    if (prototype instanceof Function) {
      throw new TypeError(`${SubscribeEvent.name} is not supported on static methods`);
    }

    const actionableMetadata = new SeHandlerMetadata({
      TargetSeCtor: SeCtor,
      HostCtor: prototype.constructor as Constructor,
      prototype: prototype as Prototype,
      descriptor: descriptor,
      propertyKey: propertyKey,
    });

    Container.get(ServerMetadataContainer).registerMethodMetadata({
      Ctor: prototype.constructor as Constructor,
      propertyKey: propertyKey,
      metadata: actionableMetadata,
    });
  }

  return handleSubscribedEvent;
}