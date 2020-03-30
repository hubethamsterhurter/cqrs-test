import { Service, Inject } from "typedi";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { ChatRepository } from "../chat/chat.repository";
import { UserRepository } from "../user/user.repository";
import { SocketWarehouse } from "../../global/socket-warehouse/socket-warehouse";
import { ServerEventConsumer } from "../../decorators/server-event-consumer.decorator";
import { SessionRepository } from "../session/session.repository";
import { SessionService } from "../session/session.service";



let __created__ = false;
@Service({ global: true })
@LogConstruction()
@ServerEventConsumer()
export class AuthTokenBroadcaster {
  private readonly _log = new ClassLogger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _userRepo
   */
  constructor(
    //
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }
}