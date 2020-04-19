import { Constructor } from "../../../../shared/types/constructor.type";
import { IActionableMetadata } from "../interface.actionable-metadata";
import { Logger } from "../../../../shared/helpers/class-logger.helper";
import { Prototype } from "../../../../shared/types/prototype.type";
import Container from "typedi";
import { EventStream } from "../../event-stream/event-stream";
import { filter } from "rxjs/operators";
import { onlyMessage } from "../../../helpers/only-message.filter.helper";
import { ctorName } from "../../../../shared/helpers/ctor-name.helper";
import { $DANGER } from "../../../../shared/types/danger.type";
import { ErrorBroadcast } from "../../../../shared/broadcasts/broadcast.error";
import { HTTP_CODE } from "../../../../shared/constants/http-code.constant";
import { createMessage } from "../../../../shared/helpers/create-message.helper";
import { BaseMessage } from "../../../../shared/base/base.message";
import { SCMessageEvent } from "../../../events/event.sc.message";

export class CommandHandlerMetadata<M extends BaseMessage> implements IActionableMetadata {
  #log = new Logger(this);

  /**
   * @constructor
   *
   * @param arg
   */
  constructor(private _opts: {
    readonly TargetCmCtor: Constructor<M>,
    readonly HostCtor: Constructor,
    readonly prototype: Prototype,
    readonly propertyKey: PropertyKey,
    readonly descriptor: PropertyDescriptor,
  }) {
    //
  }

  /** @inheritdoc */
  action(arg: { instance: M }): void {
    this
      .#log
      .info([
        `${ctorName(this)} ] Binding`,
        ` ${this._opts.HostCtor.name}.${this._opts.propertyKey.toString()}`,
        ` to "${SCMessageEvent.name}" of type "${this._opts.TargetCmCtor.name}"`,
      ].join(''));

    /**
     * @description
     * Handle a client message
     *
     * @param evt
     */
    const handle = async (evt: SCMessageEvent) => {
      try {
        const method: Function = (arg.instance as $DANGER<any>)[this._opts.propertyKey];
        await method.call(arg.instance, evt);
      } catch (err) {
        if (err instanceof Error) {
          evt.socket.send(createMessage(ErrorBroadcast, {
            code: HTTP_CODE._500,
            message: `${err.name}: ${err.message}`,
            trace: evt.trace.clone(),
          }));
        } else {
          this
            .#log
            .error('UNHANDLED Client Message Handler Error', err);
        }
      }
    }

    Container
      .get(EventStream)
      .of(SCMessageEvent)
      .pipe(filter(onlyMessage(this._opts.TargetCmCtor)))
      .subscribe(handle);
  }
}
