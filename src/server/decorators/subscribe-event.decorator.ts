// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EventHandlerMethodMetadata } from "../global/metadata-container/metadata/event-handler.method.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { ClassType } from "class-transformer/ClassTransformer";
import Container from "typedi";
import { MetadataContainer } from "../global/metadata-container/metadata-container";
import { Constructor } from "../../shared/types/constructor.type";
import { Prototype } from "../../shared/types/prototype.type";
import { BaseEvent } from "../base/base.event";

const _log = new Logger(SubscribeEvent);

export function SubscribeEvent(SeCtor: ClassType<BaseEvent>): MethodDecorator {
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

    const actionableMetadata = new EventHandlerMethodMetadata({
      TargetSeCtor: SeCtor,
      HostCtor: prototype.constructor as Constructor,
      prototype: prototype as Prototype,
      descriptor: descriptor,
      propertyKey: propertyKey,
    });

    Container.get(MetadataContainer).registerMethodMetadata({
      Ctor: prototype.constructor as Constructor,
      propertyKey: propertyKey,
      metadata: actionableMetadata,
    });
  }

  return handleSubscribedEvent;
}