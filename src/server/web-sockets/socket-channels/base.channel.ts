import { ObservableCollection } from "../../../shared/util/observable-collection.util";
import { SocketClient } from "../socket-client/socket-client";
import { IMessage } from "../../../shared/interfaces/interface.message";

export abstract class BaseChannel {
  get viewers(): ObservableCollection<SocketClient> { return this._viewers; }
  protected abstract readonly _viewers: ObservableCollection<SocketClient>;


  /**
   * @description
   * Broadcast a message to all clients
   *
   * @param msg
   */
  broadcastAll(msg: IMessage) {
    this.viewers.all.forEach(sc => sc.send(msg));
  }


  /**
   * @description
   * Broadcast a message to other sockets
   *
   * @param msg
   * @param except
   */
  broadcastOthers(msg: IMessage, except: SocketClient) {
    this.viewers.all.forEach(sc => { if (sc !== except) sc.send(msg); })
  }
}