import { Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { SocketClient } from "../socket-client/socket-client";
import { ServerMessage } from "../../../shared/message-server/modules/server-message-registry";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SocketWarehouse {
  private _log = new ClassLogger(this);
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
  remove(socket: SocketClient): void {
    this._activeSockets.delete(socket.id);
    // try to avoid race conditions if the socket is removed while messages are incoming
    const fifteenSeconds = 15000;
    setTimeout(() => this._allSockets.delete(socket.id), fifteenSeconds);
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
}


