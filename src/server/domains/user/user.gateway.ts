import * as tEi from 'fp-ts/lib/TaskEither';
import * as pipeable from 'fp-ts/lib/pipeable';
import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { SubscribeMessage } from '../../decorators/subscribe-message.decorator';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { ErrorBroadcast } from "../../../shared/broadcasts/broadcast.error";
import { EventStation } from "../../decorators/event-station.decorator";
import { CreateUserCommand } from "../../../shared/domains/user/command.create-user";
import { UpdateUserCommand } from "../../../shared/domains/user/command.update-user";
import { SCMessageEvent } from "../../events/event.sc.message";
import { UserIngress } from "./user.ingress";
import { LANGUAGES } from '../../lang/language';
import { createMessage } from '../../../shared/helpers/create-message.helper';


let __created__ = false;
@Service({ global: true })
@LogConstruction()
@EventStation()
export class UserGateway {
  #log = new Logger(this);


  /**
   * @constructor
   * 
   * @param _userIngress
   */
  constructor(
    @Inject(() => UserIngress) private readonly _userIngress: UserIngress,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }



  /**
   * @description
   * Fired when as client tries to create user
   * 
   * @param evt 
   */
  @SubscribeMessage(CreateUserCommand)
  async create(evt: SCMessageEvent<CreateUserCommand>) {
    const program = pipeable.pipe(
      this._userIngress.create({ dto: evt.message }),

      // success
      tEi.map(user => { this.#log.info('user creation success'); }),

      // fail
      tEi.mapLeft(fail => {
        this.#log.info('user creation failed', fail.message.using(LANGUAGES.EN));
        evt.socket.send(createMessage(ErrorBroadcast, {
          code: fail.code,
          message: fail.message.using(LANGUAGES.EN),
          trace: evt.trace,
        }));
      }),
    );

    // execute
    await program();
  }



  /**
   * @description
   * Fired when as user tries to sign up
   * 
   * @param evt 
   */
  @SubscribeMessage(UpdateUserCommand)
  async update(evt: SCMessageEvent<UpdateUserCommand>) {
    const program = pipeable.pipe(
      this._userIngress.update({ dto: evt.message }),

      // success
      tEi.map(user => { this.#log.info('user update success'); }),

      // fail
      tEi.mapLeft(fail => {
        this.#log.info('user update failed', fail.message.using(LANGUAGES.EN));
        evt.socket.send(createMessage(ErrorBroadcast, {
          code: fail.code,
          message: fail.message.using(LANGUAGES.EN),
          trace: evt.trace,
        }));
      }),
    );

    // execute
    await program();
  }
}