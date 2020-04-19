import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SubscribeEvent } from "../../decorators/subscribe-event.decorator";
import { SocketWarehouse } from "../socket-warehouse/socket-warehouse";
import { EventStation } from "../../decorators/event-station.decorator";
import { ctorName } from "../../../shared/helpers/ctor-name.helper";
import { ObservableCollection } from "../../../shared/util/observable-collection.util";
import { SocketClient } from "../socket-client/socket-client";
import { BaseChannel } from "./base.channel";
import { ModelCreatedBroadcast } from "../../../shared/broadcasts/broadcast.model.created";
import { ModelCreatedEvent } from "../../events/event.model-created";
import { createMessage } from "../../../shared/helpers/create-message.helper";
import { ModelUpdatedEvent } from "../../events/event.model-updated";
import { ModelDeletedEvent } from "../../events/event.model-deleted";
import { ModelDeletedBroadcast } from "../../../shared/broadcasts/broadcast.model.deleted";
import { ModelUpdatedBroadcast } from "../../../shared/broadcasts/broadcast.model.updated";



let __created__ = false;
@Service({ global: true })
@LogConstruction()
@EventStation()
export class DataChannel extends BaseChannel {
  readonly #log = new Logger(this);
  protected readonly _viewers: ObservableCollection<SocketClient>;

  /**
   * @constructor
   *
   * @param _socketWarehouse
   */
  constructor(@Inject(() => SocketWarehouse) private readonly _socketWarehouse: SocketWarehouse) {
    super();
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    this._viewers = new ObservableCollection(_socketWarehouse.sockets);

    // this.viewers.add$.subscribe((viewer) => {
    //   viewer.
    // });
  }



  /**
   * @description
   * Fired when a model is created
   *
   * @param evt
   */
  @SubscribeEvent(ModelCreatedEvent)
  private async _onModelCreated(evt: ModelCreatedBroadcast) {
    if (evt.model.deleted_at !== null) return;
    this.#log.info(` ] Broadcasting model created on ${ctorName(this)} to ${this.viewers.all.length} viewers`);
    this.broadcastAll(createMessage(ModelCreatedBroadcast, {
      CtorName: ctorName(evt.model),
      model: evt.model,
      trace: evt.trace.clone(),
    }));
  }



  /**
   * @description
   * Fired when a model is updated
   *
   * @param evt
   */
  @SubscribeEvent(ModelUpdatedEvent)
  private async _onModelUpdated(evt: ModelUpdatedEvent) {
    if (evt.model.deleted_at !== null) return;
    this.#log.info(` ] Broadcasting model updated on ${ctorName(this)} to ${this.viewers.all.length} viewers`);
    this.broadcastAll(createMessage(ModelUpdatedBroadcast, {
      ctorName: ctorName(evt.model),
      model: evt.model,
      trace: evt.trace.clone(),
    }));
  }



  /**
   * @description
   * Fired when a model is deleted
   *
   * @param evt
   */
  @SubscribeEvent(ModelDeletedEvent)
  private async _onModelDeleted(evt: ModelDeletedEvent) {
    this.#log.info(` ] Broadcasting model deleted on ${ctorName(this)} to ${this.viewers.all.length} viewers`);
    this.broadcastAll(createMessage(ModelDeletedBroadcast, {
      ctorName: ctorName(evt.model),
      model: evt.model,
      trace: evt.trace.clone(),
    }));
  }
}