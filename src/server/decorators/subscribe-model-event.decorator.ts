import { ClassType } from "class-transformer/ClassTransformer";
import { SeModelEventHandlerMetadata } from "../global/metadata-container/metadata/model-event-handler.method.metadata";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { Constructor } from "../../shared/types/constructor.type";
import { Prototype } from "../../shared/types/prototype.type";
import Container from "typedi";
import { MetadataContainer } from "../global/metadata-container/metadata-container";
import { BaseModel } from "../base/base.model";

const _log = new Logger(SubscribeModelEvent);

export function SubscribeModelEvent(
  TargetModelCtor: ClassType<BaseModel>,
  type: 'created' | 'updated' | 'deleted',
): MethodDecorator {
  /**
   * @decorator
   *
   * @param prototype       prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const handleSubscribedModelEvent = function handleSubscribedModelEvent(
    prototype: Object | Function,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${prototype.constructor.name}.${propertyKey.toString()}`);

    if (prototype instanceof Function) {
      throw new TypeError(`${SubscribeModelEvent.name} is not supported on static methods`);
    }

    const actionableMetadata = new SeModelEventHandlerMetadata({
      TargetModelCtor: TargetModelCtor,
      type: type,
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

    // const CmCtor = type === 'created' ?
    //   ModelCreatedSmo :
    //   type === 'updated' ?
    //   ModelUpdatedSmo :
    //   type === 'deleted' ?
    //   ModelDeletedSmo :
    //   undefined;

    // if (!CmCtor) { throw new Error(`Unhandled type ${type}`); }
    // Container.get(MessageRegistry).add(CmCtor);
  }

  return handleSubscribedModelEvent;
}