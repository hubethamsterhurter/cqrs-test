import Container from "typedi";
import { $FIX_ME } from "../../shared/types/fix-me.type";
import { ClassLogger } from "../../shared/helpers/class-logger.helper";
import { ClientMessageHandlerMetadata } from "./meatadata/client-message-handler.metadata";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { SocketClientMessageParsedSeo } from "../events/models/socket-client.message-parsed.seo";
import { filter } from "rxjs/operators";
import { ofClientMessage } from "../helpers/server-client-message-event-filter.helper";
import { ServerModelCreatedEventHandlerMetadata } from "./meatadata/server-model-created-event-handler.metadata";
import { ModelCreatedSeo } from "../events/models/model-created.seo";
import { ModelDeletedSeo } from "../events/models/model-deleted.seo";
import { ModelUpdatedSeo } from "../events/models/model-updated.seo";
import { ServerEventHandlerMetadata } from "./meatadata/server-event-handler.metadata";
import { ServerModelDeletedEventHandlerMetadata } from "./meatadata/server-model-deleted-event-handler.metadata";
import { serverModelDeletedEventOf, serverModelUpdatedEventOf, serverModelCreatedEventOf } from "../helpers/server-model-event-filter.helper";
import { ServerModelUpdatedEventHandlerMetadata } from "./meatadata/server-model-updated-event-handler.metadata";
import { ServerMetadata } from "./meatadata/server-metadata.type";
import { $DANGER } from "../../shared/types/danger.type";

const _log = new ClassLogger('ServerEventConsumerDecorator');

function bindMetadata(opts: {
  mdKey: string | symbol,
  metadata: ServerMetadata | unknown,
  Ctor: Function,
  instance: any,
  propKey: string | symbol
}) {
  const {
    mdKey,
    metadata,
    Ctor,
    instance,
    propKey,
  } = opts;

  if (metadata instanceof ClientMessageHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ClientMessage ${metadata.ClientMessageCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(SocketClientMessageParsedSeo)
      .pipe(filter(ofClientMessage(metadata.ClientMessageCtor)))
      .subscribe((evt) => instance[propKey as $DANGER<keyof any>](evt));
  }

  else if (metadata instanceof ServerModelCreatedEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ${ModelCreatedSeo.name} of type ${metadata.ModelCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(ModelCreatedSeo)
      .pipe(filter(serverModelCreatedEventOf(metadata.ModelCtor)))
      .subscribe((evt) => instance[propKey as $DANGER<keyof any>](evt));
  }

  else if (metadata instanceof ServerModelUpdatedEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ${ModelUpdatedSeo.name} of type ${metadata.ModelCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(ModelUpdatedSeo)
      .pipe(filter(serverModelUpdatedEventOf(metadata.ModelCtor)))
      .subscribe((evt) => instance[propKey as $DANGER<keyof any>](evt));
  }

  else if (metadata instanceof ServerModelDeletedEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ${ModelDeletedSeo.name} of type ${metadata.ModelCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(ModelDeletedSeo)
      .pipe(filter(serverModelDeletedEventOf(metadata.ModelCtor)))
      .subscribe((evt) => instance[propKey as $DANGER<keyof any>](evt));
  }

  else if (metadata instanceof ServerEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ServerEvent of type ${metadata.ServerEventCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(metadata.ServerEventCtor)
      .subscribe((evt) => instance[propKey as $DANGER<keyof any>](evt));
  }

  else {
    if (mdKey === 'design:returntype' || mdKey === 'design:paramtypes' || mdKey === 'design:type') {
      // don't bother
    } else {
      _log.warn(`!! ${mdKey.toString()} !! ] Unhandled metadata for ${Ctor.name}.${propKey.toString()}`);
    }
  }
}


/**
 * @description
 * Only works for DI'd classes
 */
export function ServerEventConsumer(): ClassDecorator {
  // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  const ServerEventConsumerFn: ClassDecorator = function ServerEventConsumerFn<T extends Function>(OriginalCtor: T) {
    // console.log('-------------------------------------------------------------');
    // console.log(`----------------    ${OriginalCtor.name}     ----------------`);
    // console.log('-------------------------------------------------------------');

    const ServerEventConsumerFn = function ServerEventConsumerFn(...args: any[]): $FIX_ME<any> {
      // console.log('*************************************************************');
      // console.log(`****************    ${OriginalCtor.name}     ****************`);
      // console.log('*************************************************************');

      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // @DANGER:
      //
      const instance = Container.get(OriginalCtor);
      // new (OriginalCtor as $FIX_ME<any>)(...args);
      //
      // THIS IS POTENTIALLY VERY DANGEROUS???????????????????????????????
      // WE'RE IN A CONSTRUCTOR FUNCTION CALLING A CONSTRUCTOR FUNCTION TO BUILD OURSELF
      // I DON'T EVEN KNOW WHY THIS WORKS
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      const propKeys = Reflect.ownKeys(OriginalCtor.prototype); // Reflect.getPrototypeOf()

      // _log.info(`Actioning metadata on ${propKeys.length} keys of ${OriginalCtor.name}`);
      propKeys.forEach(propKey => {
        if (typeof propKey === 'number') return;
        const mdKeys = Reflect.getMetadataKeys(OriginalCtor.prototype, propKey);
        // _log.info(`Actioning ${mdKeys.length} metadata keys on ${OriginalCtor.name}.${propKey.toString()}`);
        mdKeys.forEach(mdKey => {
          // _log.info(`Actioning metadata ${OriginalCtor.name}.${propKey.toString()}.${mdKeys.toString()}`);
          const metadata: ServerMetadata | unknown = Reflect.getMetadata(mdKey, OriginalCtor.prototype, propKey);
          if (Array.isArray(metadata)) {
            metadata.forEach(meta => bindMetadata({ mdKey, metadata, Ctor: OriginalCtor, instance, propKey }));
          } else {
            bindMetadata({ mdKey, metadata, Ctor: OriginalCtor, instance, propKey });
          }
        });
      })

      return instance;
    } as $FIX_ME<unknown> as T

    return ServerEventConsumerFn;
  };

  return ServerEventConsumerFn;
}