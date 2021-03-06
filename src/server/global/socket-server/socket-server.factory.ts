import ws from 'ws';
import { Service, Inject } from "typedi";
import { ServerEventBus } from "../event-bus/server-event-bus";
import { ServerEventStream } from "../event-stream/server-event-stream";
import { SocketServer } from "./socket-server";
import { Factory } from '../../../shared/types/factory.type';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SocketServerFactory implements Factory<SocketServer> {
  constructor(
    @Inject(() => ServerEventBus) private _eb: ServerEventBus,
    @Inject(() => ServerEventStream) private _es: ServerEventStream,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }

  create(): SocketServer {
    const wss = new ws.Server({
      port: 5500,
      perMessageDeflate: undefined,
    });

    const socketServer = new SocketServer(
      wss,
      this._eb,
      this._es,
    );

    return socketServer;
  }
}