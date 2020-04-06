import { Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { SocketClient } from "../socket-client/socket-client";
import { ObservableCollection } from "../../../shared/util/observable-collection.util";

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SocketWarehouse {
  private _log = new Logger(this);
  readonly sockets: ObservableCollection<SocketClient> = new ObservableCollection([] as SocketClient[]);

  /**
   * @constructor
   */
  constructor() {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}


