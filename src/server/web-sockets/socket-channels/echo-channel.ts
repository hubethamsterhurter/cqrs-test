import { Service, Inject } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { EventStation } from "../../decorators/event-station.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SocketWarehouse } from "../socket-warehouse/socket-warehouse";
import { SubscribeEvent } from "../../decorators/subscribe-event.decorator";
import { BaseChannel } from "./base.channel";
import { ObservableCollection } from "../../../shared/util/observable-collection.util";
import { SocketClient } from "../socket-client/socket-client";
import { SCMessageInvalidEvent } from "../../events/event.sc.message-invalid";
import { SCMessageMalformedEvent } from "../../events/event.sc.message-errored";
import { createMessage } from "../../../shared/helpers/create-message.helper";
import { CommandInvalidBroadcast } from "../../../shared/broadcasts/broadcast.command-invalid";
import { CommandMalformedBroadcast } from "../../../shared/broadcasts/broadcast.command-malformed";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@EventStation()
export class EchoChannel extends BaseChannel {
  readonly #log = new Logger(this);
  protected readonly _viewers: ObservableCollection<SocketClient>;

  /**
   * @constructor
   *
   * @param _socketWarehouse
   */
  constructor(@Inject(() => SocketWarehouse) _socketWarehouse: SocketWarehouse) {
    super();
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    this._viewers = new ObservableCollection(_socketWarehouse.sockets);
  }



  // /**
  //  * TODO: remove test
  //  *
  //  * @description
  //  * Fired on app heartbeat
  //  * 
  //  * @param evt 
  //  */
  // @SubscribeEvent(AppHeartbeatSeo)
  // private async _onAppHeartbeat1(evt: AppHeartbeatSeo) {
  //   // TESTING ERROR
  //   this.broadcastAll(new ServerHeartbeatSmo({ trace: evt.trace.clone(), at: 'hi :)' as any, } as any));
  // }



  // /**
  //  * TODO: remove test
  //  *
  //  * @description
  //  * Fired on app heartbeat
  //  * 
  //  * @param evt 
  //  */
  // @SubscribeEvent(AppHeartbeatSeo)
  // private async _onAppHeartbeat2(evt: AppHeartbeatSeo) {
  //   // TESTING ERROR
  //   this.broadcastAll({ hello: 'world' } as any);
  // }



  /**
   * @description
   * Fired when a client message is invalid
   * 
   * @param evt 
   */
  @SubscribeEvent(SCMessageInvalidEvent)
  private async _onInvalidClientMessage(evt: SCMessageInvalidEvent) {
    evt
      .socket
      .send(createMessage(CommandInvalidBroadcast, {
        errors: evt.errs,
        MessageCtorName: evt.MessageCtor.name,
        trace: evt.trace.clone(),
      }));
  }


  /**
   * @description
   * Fired when a client message is malformed
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageMalformedEvent)
  private async _onMalformedClientMessage(evt: SCMessageMalformedEvent) {
    evt
      .socket
      .send(createMessage(CommandMalformedBroadcast, {
        error: evt.err,
        trace: evt.trace.clone(),
      }));
  }
}