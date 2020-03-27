import { Service, Inject } from "typedi";
import { IdFactory } from "../../../shared/helpers/id.factory";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { BaseRepository } from "../base-repository";
import { ClientModel } from "../../../shared/domains/connected-client/client.model";
import { SocketClient } from "../../global/socket-client/socket-client";

let __created__ = false;
@Service({ global: true })
export class ClientRepository extends BaseRepository<ClientModel> {
  /**
   * @constructor
   *
   * @param _idFactory
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => IdFactory) readonly _idFactory: IdFactory,
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private readonly _es: ServerEventStream,
  ) {
    super(_idFactory, ClientModel, _eb);
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}