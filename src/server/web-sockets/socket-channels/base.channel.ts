import { ObservableCollection } from "../../../shared/util/observable-collection.util";
import { SocketClient } from "../socket-client/socket-client";
import { BaseMessage } from "../../../shared/base/base.message";
import { Logger } from "../../../shared/helpers/class-logger.helper";

export abstract class BaseChannel {
  readonly #log = new Logger(this)

  get viewers(): ObservableCollection<SocketClient> { return this._viewers; }
  protected abstract readonly _viewers: ObservableCollection<SocketClient>;


  /**
   * @description
   * Broadcast a message to all clients
   *
   * @param message
   */
  broadcastAll(message: BaseMessage) {
    this.#log.message(message);
    const strMsg = JSON.stringify(message);
    this.viewers.all.forEach(sc => sc.sendRaw(strMsg));
  }


  /**
   * @description
   * Broadcast a message to other sockets
   *
   * @param message
   * @param except
   */
  broadcastOthers(message: BaseMessage, except: SocketClient) {
    this.#log.message(message);
    const strMsg = JSON.stringify(message);
    this.viewers.all.forEach(sc => { if (sc !== except) sc.sendRaw(strMsg); })
  }
}