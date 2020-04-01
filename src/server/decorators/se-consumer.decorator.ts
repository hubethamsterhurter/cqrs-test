import Container from "typedi";
import { $FIX_ME } from "../../shared/types/fix-me.type";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { ClientMessageHandlerMetadata } from "./meatadata/client-message-handler.metadata";
import { ServerEventStream } from "../global/event-stream/server-event-stream";
import { SCMessageSeo } from "../events/models/sc.message-parsed.seo";
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
import { ErrorSmo } from "../../shared/smo/error.smo";
import { HTTP_CODE } from "../../shared/constants/http-code.constant";

const _log = new Logger('ServerEventConsumerDecorator');

/**
 * @description
 * Try/catch client message handlers
 *
 * @param instance
 * @param propKey
 */
function fireCmHandler(instance: any, propKey: string | symbol) {
  return async function doFireCmHandler(evt: SCMessageSeo) {
    try {
      await instance[propKey as $DANGER<keyof any>](evt)
    } catch (err) {
      if (err instanceof Error) {
        evt._p.socket.send(new ErrorSmo({
          dto: new ErrorSmoDe
          code: HTTP_CODE._500,
          message: `${err.name}: ${err.message}`,
          trace: evt.trace.clone(),
        }))
      } else {
        _log.error('UNHANDLED Client Message Handler Error', err);
      }
    }
  }
}

/**
 * @description
 * Try/catch server event handlers
 *
 * @param instance
 * @param propKey
 */
function fireSmHandler(instance: any, propKey: string | symbol) {
  return async function doFireSmHandler(evt: ServerEvent) {
    try {
      await instance[propKey as $DANGER<keyof any>](evt)
    } catch (err) {
      _log.error('UNHANDLED Server Event Handler Error', err);
    }
  }
}



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
      .of(SCMessageSeo)
      .pipe(filter(ofClientMessage(metadata.ClientMessageCtor)))
      .subscribe(fireCmHandler(instance, propKey));
  }

  else if (metadata instanceof ServerModelCreatedEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ${ModelCreatedSeo.name} of type ${metadata.ModelCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(ModelCreatedSeo)
      .pipe(filter(serverModelCreatedEventOf(metadata.ModelCtor)))
      .subscribe(fireSmHandler(instance, propKey));
  }

  else if (metadata instanceof ServerModelUpdatedEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ${ModelUpdatedSeo.name} of type ${metadata.ModelCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(ModelUpdatedSeo)
      .pipe(filter(serverModelUpdatedEventOf(metadata.ModelCtor)))
      .subscribe(fireSmHandler(instance, propKey));
  }

  else if (metadata instanceof ServerModelDeletedEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ${ModelDeletedSeo.name} of type ${metadata.ModelCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(ModelDeletedSeo)
      .pipe(filter(serverModelDeletedEventOf(metadata.ModelCtor)))
      .subscribe(fireSmHandler(instance, propKey));
  }

  else if (metadata instanceof ServerEventHandlerMetadata) {
    _log.info(`${mdKey.toString()} ] Binding ${Ctor.name}.${metadata.propertyKey.toString()} to ServerEvent of type ${metadata.ServerEventCtor.name}`);
    Container
      .get(ServerEventStream)
      .of(metadata.ServerEventCtor)
      .subscribe(fireSmHandler(instance, propKey));
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
export function SeConsumer(): ClassDecorator {
  const SEConsmerDecorator: ClassDecorator = function SEConsumerDecorator<T extends Function>(OriginalCtor: T) {
    const ModifiedSeConsumerCtor = function ModifiedSeConsumerCtor(...args: any[]): $FIX_ME<any> {
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // @DANGER:
      //
      const instance = Container.get(OriginalCtor);
      // new (OriginalCtor as $FIX_ME<any>)(...args);
      //
      // THIS IS POTENTIALLY VERY DANGEROUS???????????????????????????????
      // WE'RE IN A CONSTRUCTOR FUNCTION CALLING A CONSTRUCTOR FUNCTION TO BUILD OURSELF
      // NOT 100% SURE WHY IT WORKS
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

    return ModifiedSeConsumerCtor;
  };

  return SEConsmerDecorator;
}