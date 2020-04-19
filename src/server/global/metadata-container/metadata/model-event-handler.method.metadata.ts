import { Constructor } from "../../../../shared/types/constructor.type";
import { IActionableMetadata } from "../interface.actionable-metadata";
import { Prototype } from "../../../../shared/types/prototype.type";
import Container from "typedi";
import { EventStream } from "../../event-stream/event-stream";
import { Logger } from "../../../../shared/helpers/class-logger.helper";
import { onlyCreatedModel, onlyUpdatedModel, onlyDeletedModel } from "../../../helpers/only-model.filter.helper";
import { $DANGER } from "../../../../shared/types/danger.type";
import { filter } from "rxjs/operators";
import { ctorName } from "../../../../shared/helpers/ctor-name.helper";
import { BaseModel } from "../../../base/base.model";
import { BaseEvent } from "../../../base/base.event";
import { ModelCreatedEvent } from "../../../events/event.model-created";
import { ModelUpdatedEvent } from "../../../events/event.model-updated";
import { ModelDeletedEvent } from "../../../events/event.model-deleted";

export class SeModelEventHandlerMetadata<M extends BaseModel> implements IActionableMetadata {
  #log = new Logger(this);

  /**
   * @constructor
   *
   * @param ModelCtor
   */
  constructor(readonly _opts: {
    readonly type: 'created' | 'updated' | 'deleted';
    readonly TargetModelCtor: Constructor<M>;
    readonly HostCtor: Constructor;
    readonly prototype: Prototype;
    readonly propertyKey: PropertyKey;
    readonly descriptor: PropertyDescriptor;
  }) {
    //
  }

  /** @inheritdoc */
  action(arg: {
    instance: M,
  }): void {
    this
      .#log
      .info([
        `${ctorName(this)} ] Binding`,
        ` ${this._opts.HostCtor.name}.${this._opts.propertyKey.toString()}`,
        ` to "${this._opts.type}" event of model "${this._opts.TargetModelCtor.name}"`,
      ].join(''));

    /**
     * @description
     * Handle a model event
     * 
     * @param evt 
     */
    const handle = async (evt: BaseEvent) => {
      try {
        const method: Function = (arg.instance as $DANGER<any>)[this._opts.propertyKey];
        await method.call(arg.instance, evt);
      } catch (err) {
        this
          .#log
          .error('UNHANDLED Server Event Handler Error', err);
      }
    }

    if (this._opts.type === 'created') {
      Container
        .get(EventStream)
        .of(ModelCreatedEvent)
        .pipe(filter(onlyCreatedModel(this._opts.TargetModelCtor)))
        .subscribe(handle);
    }

    else if (this._opts.type === 'updated') {
      Container
        .get(EventStream)
        .of(ModelUpdatedEvent)
        .pipe(filter(onlyUpdatedModel(this._opts.TargetModelCtor)))
        .subscribe(handle);
    }

    else if (this._opts.type === 'deleted') {
      Container
        .get(EventStream)
        .of(ModelDeletedEvent)
        .pipe(filter(onlyDeletedModel(this._opts.TargetModelCtor)))
        .subscribe(handle);
    }

    else {
      this
        .#log
        .warn(`Unhandled option type "${this._opts.type}"`);
    }
  }
}
