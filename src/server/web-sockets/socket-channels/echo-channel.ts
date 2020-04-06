import { Service, Inject } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SocketWarehouse } from "../socket-warehouse/socket-warehouse";
import { SubscribeEvent } from "../../decorators/subscribe-event.decorator";
import { AppHeartbeatSeo } from "../../events/models/app-heartbeat.seo";
import { ServerHeartbeatSmo } from "../../../shared/smo/server-heartbeat.smo";
import { SCMessageInvalidSeo } from "../../events/models/sc.message-invalid.seo";
import { CmInvalidSmo, CmInvalidSmDto } from "../../../shared/smo/cm.invalid.smo";
import { SCMessageMalformedSeo } from "../../events/models/sc.message-errored.seo";
import { CMMalformedSmo, CmMalformedSmDto } from "../../../shared/smo/cm.malformed.smo";
import { BaseChannel } from "./base.channel";
import { ObservableCollection } from "../../../shared/util/observable-collection.util";
import { SocketClient } from "../socket-client/socket-client";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
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
  @SubscribeEvent(SCMessageInvalidSeo)
  private async _onInvalidClientMessage(evt: SCMessageInvalidSeo) {
    evt
      .dto
      .socket
      .send(new CmInvalidSmo({
        dto: new CmInvalidSmDto({
          errors: evt.dto.errs,
          MessageCtorName: evt.dto.MessageCtor.name,
        }),
        trace: evt.trace.clone(),
      }));
  }


  /**
   * @description
   * Fired when a client message is malformed
   *
   * @param evt
   */
  @SubscribeEvent(SCMessageMalformedSeo)
  private async _onMalformedClientMessage(evt: SCMessageMalformedSeo) {
    evt
      .dto
      .socket
      .send(new CMMalformedSmo({
        dto: new CmMalformedSmDto({
          error: evt.dto.err,
        }),
        trace: evt.trace.clone(),
      }));
  }
}