import { ClassType } from "class-transformer/ClassTransformer";
import { IActionableMetadata } from "../interface.actionable-metadata";
import Container from "typedi";
import { EventStream } from "../../event-stream/event-stream";
import { Constructor } from "../../../../shared/types/constructor.type";
import { Prototype } from "../../../../shared/types/prototype.type";
import { Logger } from "../../../../shared/helpers/class-logger.helper";
import { $DANGER } from "../../../../shared/types/danger.type";
import { ctorName } from "../../../../shared/helpers/ctor-name.helper";
import { BaseEvent } from "../../../base/base.event";

export class EventHandlerMethodMetadata<E extends BaseEvent> implements IActionableMetadata {
  #log = new Logger(this);

  /**
   * @constructor
   *
   * @param arg
   */
  constructor(readonly _opts: {
    readonly TargetSeCtor: ClassType<E>,
    readonly HostCtor: Constructor,
    readonly prototype: Prototype,
    readonly propertyKey: PropertyKey,
    readonly descriptor: PropertyDescriptor,
  }) {
    //
  }

  /** @inheritdoc */
  action(arg: {
    instance: E,
  }): void {
    this
      .#log
      .info([
        `${ctorName(this)} ] Binding`,
        ` ${this._opts.HostCtor.name}.${this._opts.propertyKey.toString()}`,
        ` to ${this._opts.TargetSeCtor.name}`,
      ].join(''));

    const handle = async (evt: BaseEvent) => {
      try {
        const method: Function = (arg.instance as $DANGER<any>)[this._opts.propertyKey];
        await method.call(arg.instance, evt);
      } catch (err) {
        this
          .#log
          .error(err);
      }
    }

    Container
      .get(EventStream)
      .of(this._opts.TargetSeCtor)
      .subscribe(handle);
  }
}
