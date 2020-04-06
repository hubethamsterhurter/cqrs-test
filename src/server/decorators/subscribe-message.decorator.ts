import { Logger } from "../../shared/helpers/class-logger.helper";
import { IMessage } from "../../shared/interfaces/interface.message";
import Container from "typedi";
import { Constructor } from "../../shared/types/constructor.type";
import { Prototype } from "../../shared/types/prototype.type";
import { CmHandlerMetadata } from "../global/metadata-container/metadata/cm.handler.method.metadata";
import { ServerMetadataContainer } from "../global/metadata-container/server-metadata-container";
import { MessageRegistry } from "../../shared/util/message-registry.util";

const _log = new Logger(SubscribeMessage);

export function SubscribeMessage(CmCtor: Constructor<IMessage>): MethodDecorator {
  /**
   * @decorator
   *
   * @param prototype       prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const handleSubscribedMessage = function handleSubscribedMessage(
    prototype: Object | Function,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${prototype.constructor.name}.${propertyKey.toString()}`);

    if (prototype instanceof Function) {
      throw new TypeError(`${SubscribeMessage.name} is not supported on static methods`);
    }

    const actionableMetadata = new CmHandlerMetadata({
      TargetCmCtor: CmCtor,
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

    Container.get(MessageRegistry).add(CmCtor);
  }

  return handleSubscribedMessage;
}