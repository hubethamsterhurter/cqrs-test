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
import { ClientMessageSignUp } from "../../../shared/message-client/models/client-message.sign-up";
import { ServerEventUserSignedUp } from "../../events/models/server-event.user.signed-up";
import { UnsavedModel } from "../../../shared/types/unsaved-model.type";


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
   * @param _userRepo
   */
  constructor(
    @Inject(() => ServerEventBus) readonly _eb: ServerEventBus,
    @Inject(() => ServerEventStream) readonly _es: ServerEventStream,
    @Inject(() => UserRepository) readonly _userRepo: UserRepository,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    // sign-up user
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageSignUp)))
      .subscribe(async (evt) => {
        const rawUser: UnsavedModel<UserModel> = {
          user_name: evt._p.message.user_name,
          password: evt._p.message.password,
          colour: randomElement(USER_COLOURS),
        };
        const user = await this._userRepo.create(rawUser);

        this
          ._eb
          .fire(new ServerEventUserSignedUp({ user, socket: evt._p.socket }));
      });


    // create user
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageCreateUser)))
      .subscribe(async (evt) => {
        const rawUser: UnsavedModel<UserModel> = {
          user_name: evt._p.message.user_name,
          password: evt._p.message.password,
          colour: randomElement(USER_COLOURS),
        };
        await this._userRepo.create(rawUser);
      });

    // update user
    this
      ._es
      .of(ServerEventSocketClientMessageParsed)
      .pipe(op.filter(ofClientMessage(ClientMessageUpdateUser)))
      .subscribe(async (evt) => {
        const oldUser = await this._userRepo.findOne(evt._p.message.id);
        if (oldUser) {
          if (evt._p.message.user_name) oldUser.user_name = evt._p.message.user_name;
          if (evt._p.message.password) oldUser.password = evt._p.message.password;
          this._userRepo.upsert(oldUser);
        } else {
          this._log.warn(`Tried ot update non-existant user ${evt._p.message.id}`);
        }
      });
  }
}
