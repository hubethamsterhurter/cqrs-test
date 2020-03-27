import * as op from "rxjs/operators";
import { Service, Inject } from "typedi";
import { ServerEventStream } from "../../global/event-stream/server-event-stream";
import { ServerEventBus } from "../../global/event-bus/server-event-bus";
import { UserRepository } from "./user.repository";
import { ServerEventSocketClientMessageParsed } from "../../events/models/server-event.socket-client.message-parsed";
import { ofClientMessage } from "../../helpers/server-client-message-event-filter.helper";
import { ClientMessageCreateUser } from "../../../shared/message-client/models/client-message.create-user";
import { UserModel } from "../../../shared/domains/user/user.model";
import { ClientMessageUpdateUser } from "../../../shared/message-client/models/client-message.update-user";
import { ClassLogger } from "../../../shared/helpers/class-logger.helper";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { randomElement } from "../../../shared/helpers/random-element";
import { USER_COLOURS } from "../../../shared/constants/user-colour";


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class UserService {
  private readonly _log = new ClassLogger(this);

  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   * @param _repository
   */
  constructor(
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) readonly _es: ServerEventStream,
    @Inject(() => UserRepository) readonly _repository: UserRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // create user
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageCreateUser)))
      .subscribe(async (evt) => {
        const now = new Date();
        const user = new UserModel({
          user_name: evt._p.message.user_name,
          password: evt._p.message.password,
          colour: randomElement(USER_COLOURS),
          updated_at: now,
          created_at: now,
          deleted_at: null,
        });
        await this._repository.create(user);
      });

    // update user
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageUpdateUser)))
      .subscribe(async (evt) => {
        const now = new Date();
        const oldUser = await this._repository.findOne(evt._p.message.id);
        if (oldUser) {
          if (evt._p.message.user_name) oldUser.user_name = evt._p.message.user_name;
          if (evt._p.message.password) oldUser.password = evt._p.message.password;
          oldUser.updated_at = now;
          this._repository.upsert(oldUser);
        } else {
          this._log.warn(`Tried ot update non-existant user ${evt._p.message.id}`);
        }
      });
  }
}
