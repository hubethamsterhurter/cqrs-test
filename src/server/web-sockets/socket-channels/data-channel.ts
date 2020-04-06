import { Service, Inject } from "typedi";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ModelCreatedSeo } from "../../events/models/model-created.seo";
import { ModelUpdatedSeo } from "../../events/models/model-updated.seo";
import { ModelDeletedSeo } from "../../events/models/model-deleted.seo";
import { SubscribeEvent } from "../../decorators/subscribe-event.decorator";
import { SocketWarehouse } from "../socket-warehouse/socket-warehouse";
import { SeConsumer } from "../../decorators/se-consumer.decorator";
import { ModelUpdatedSmo, ModelUpdatedSmDto } from "../../../shared/smo/mode.updated.smo";
import { ctorName } from "../../../shared/helpers/ctor-name.helper";
import { ModelCreatedSmo, ModelCreatedSmDto } from "../../../shared/smo/model.created.smo";
import { ModelDeletedSmo, ModelDeletedSmDto } from "../../../shared/smo/model.deleted.smo";
import { ObservableCollection } from "../../../shared/util/observable-collection.util";
import { SocketClient } from "../socket-client/socket-client";
import { BaseChannel } from "./base.channel";



let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SeConsumer()
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
  @SubscribeEvent(ModelCreatedSeo)
  private async _onModelCreated(evt: ModelCreatedSeo) {
    if (evt.dto.model.deleted_at !== null) return;
    this.#log.info(` ] Broadcasting model created on ${ctorName(this)} to ${this.viewers.all.length} viewers`);
    this.broadcastAll(new ModelCreatedSmo({
      dto: new ModelCreatedSmDto({
        CtorName: ctorName(evt.dto.model),
        model: evt.dto.model,
      }),
      trace: evt.trace.clone(),
    }));
  }



  /**
   * @description
   * Fired when a model is updated
   *
   * @param evt
   */
  @SubscribeEvent(ModelUpdatedSeo)
  private async _onModelUpdated(evt: ModelUpdatedSeo) {
    if (evt.dto.model.deleted_at !== null) return;
    this.#log.info(` ] Broadcasting model updated on ${ctorName(this)} to ${this.viewers.all.length} viewers`);
    this.broadcastAll(new ModelUpdatedSmo({
      dto: new ModelUpdatedSmDto({
        CtorName: ctorName(evt.dto.model),
        model: evt.dto.model,
      }),
      trace: evt.trace.clone(),
    }));
  }



  /**
   * @description
   * Fired when a model is deleted
   *
   * @param evt
   */
  @SubscribeEvent(ModelDeletedSeo)
  private async _onModelDeleted(evt: ModelDeletedSeo) {
    if (evt.dto.model.deleted_at !== null) return;
    this.#log.info(` ] Broadcasting model deleted on ${ctorName(this)} to ${this.viewers.all.length} viewers`);
    this.broadcastAll(new ModelDeletedSmo({
      dto: new ModelDeletedSmDto({
        CtorName: ctorName(evt.dto.model),
        model: evt.dto.model,
      }),
      trace: evt.trace.clone(),
    }));
  }
}