import Container from "typedi";
import { $FIX_ME } from "../../shared/types/fix-me.type";
import { ServerMetadataContainer } from "../global/metadata-container/server-metadata-container";
import { Constructor } from "../../shared/types/constructor.type";

// const _log = new Logger('ServerEventConsumerDecorator');

/**
 * @description
 * Only works for DI'd classes
 */
export function SeConsumer(): ClassDecorator {
  const SEConsmerDecorator: ClassDecorator = function SEConsumerDecorator<T extends Function>(OriginalCtor: T) {
    const ModifiedSeConsumerCtor: T = function ModifiedSeConsumerCtor(...args: any[]): $FIX_ME<any> {
      const instance: InstanceType<any> = Container.get(OriginalCtor);
      const mdContainer = Container.get(ServerMetadataContainer);
      const classMetadata = mdContainer.get({ Ctor: OriginalCtor as unknown as Constructor });
      if (classMetadata) {
        // for (const actionable of classMetadata.)
        classMetadata
          .prototypeMetadata
          .forEach(methodActionables => methodActionables.forEach(actionable => {
            actionable.action({ instance});
          }));
      }

      return instance;
    } as $FIX_ME<unknown> as T

    return ModifiedSeConsumerCtor;
  };

  return SEConsmerDecorator;
}