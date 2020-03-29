import { ClientMessageCtor } from "../../shared/message-client/modules/client-message-registry";
import { SERVER_METADATA_KEY } from "./meatadata/metadata-key";
import { ClientMessageHandlerMetadata } from "./meatadata/client-message-handler.metadata";
import { A_CLIENT_MESSAGE_TYPE } from "../../shared/message-client/modules/client-message-type";
import { Has_t } from "../../shared/types/has-_t.type";
import { ClassLogger } from "../../shared/helpers/class-logger.helper";

const _log = new ClassLogger(HandleClientMessage);

export function HandleClientMessage<T extends A_CLIENT_MESSAGE_TYPE>(
  ClientMessageCtor: Extract<ClientMessageCtor, Has_t<T>>
): MethodDecorator {
  /**
   * @decorator
   *
   * @param target          prototype for instance member, constructor for static member
   * @param propertyKey     name of the member
   * @param descriptor      property descriptor for the member
   */
  const doHandleClientMessage = function doHandleClientMessage(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    _log.info(`Registering metadata for ${target.constructor.name}.${propertyKey.toString()}`);
    Reflect.defineMetadata(
      SERVER_METADATA_KEY.CLIENT_MESSAGE_HANDLER,
      new ClientMessageHandlerMetadata(
        ClientMessageCtor,
        propertyKey,
        descriptor
      ),
      target,
      propertyKey,
    );

    // // TODO: cleanup
    // const subscription = Container
    //   .get(ServerEventStream)
    //   .of(ServerEventSocketClientMessageParsed)
    //   .pipe(filter(ofClientMessage(MessageCtor)))
    //   .subscribe((evt) => descriptor.value.apply(this, evt));
  }

  return doHandleClientMessage;
}