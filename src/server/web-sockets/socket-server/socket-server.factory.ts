import ws from 'ws';
import { Service, Inject } from "typedi";
import { EventBus } from "../../global/event-bus/event-bus";
import { EventStream } from "../../global/event-stream/event-stream";
import { SocketServer } from "./socket-server";
import { Factory } from '../../../shared/types/factory.type';
import { LogConstruction } from '../../../shared/decorators/log-construction.decorator';
import { UserCrudService } from '../../domains/user/user.crud.service';

let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class SocketServerFactory implements Factory<SocketServer> {
  constructor(
    @Inject(() => EventBus) private _eb: EventBus,
    @Inject(() => EventStream) private _es: EventStream,
    @Inject(() => UserCrudService) private _userService: UserCrudService,
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