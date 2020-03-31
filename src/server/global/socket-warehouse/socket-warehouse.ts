import { Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SocketClient } from "../socket-client/socket-client";
import { ServerMessage } from "../../../shared/message-server/modules/server-message-registry";
import { SEConsumer } from "../../decorators/se-consumer.decorator";
import { HandleSe } from "../../decorators/handle-ce.decorator";
import { SCCloseSeo } from "../../events/models/sc.close.seo";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
@SEConsumer()
export class SocketWarehouse {
  private _log = new Logger(this);
  private _allSockets: Map<string, SocketClient> = new Map();
  private _activeSockets: Map<string, SocketClient> = new Map();


  /**
   * @constructor
   */
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Add a socket
   *
   * @param socket
   */
  add(socket: SocketClient): void {
    this._allSockets.set(socket.id, socket);
    this._activeSockets.set(socket.id, socket);
  }


  /**
   * @description
   * remove a socket
   *
   * @param socket
   */
  remove(socket_id: string): void {
    this._activeSockets.delete(socket_id);
    // try to avoid race conditions if the socket is removed while messages are incoming
    const fifteenSeconds = 15000;
    setTimeout(() => this._allSockets.delete(socket_id), fifteenSeconds);
  }


  /**
   * @description
   * Find a socket or throw an error
   * 
   * @param id 
   */
  findOne(id: string): SocketClient | null {
    const socket = this._allSockets.get(id);
    return socket ?? null;
  }


  /**
   * @description
   * Find a socket or throw an error
   * 
   * @param id 
   */
  findOneOrFail(id: string): SocketClient {
    const socket = this._allSockets.get(id);
    if (!socket) throw new ReferenceError(`Unable to find client socket "${id}"`);
    return socket;
  }



  /**
   * @description
   * Broadcast a message to all clients
   *
   * @param msg
   */
  broadcastAll(msg: ServerMessage) {
    this._activeSockets.forEach(wsc => wsc.send(msg));
  }


  /**
   * @description
   * Broadcast a message to other sockets
   *
   * @param msg
   * @param except
   */
  broadcastOthers(msg: ServerMessage, except: SocketClient) {
    this._activeSockets.forEach(wsc => { if (wsc.id !== except.id) wsc.send(msg); })
  }


  /**
   * @description
   * Fired when a socket client disconnects
   * 
   * @param evt 
   */
  @HandleSe(SCCloseSeo)
  private async _handleSCCClose(evt: SCCloseSeo) {
    this.remove(evt._p.socket.id);
  }
}


