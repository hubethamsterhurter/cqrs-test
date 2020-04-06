import { IModel } from "../../../../shared/interfaces/interface.model";
import { Constructor } from "../../../../shared/types/constructor.type";
import { IActionableMetadata } from "../interface.actionable-metadata";
import { Prototype } from "../../../../shared/types/prototype.type";
import Container from "typedi";
import { ServerEventStream } from "../../event-stream/server-event-stream";
import { Logger } from "../../../../shared/helpers/class-logger.helper";
import { serverModelCreatedEventOf, serverModelUpdatedEventOf, serverModelDeletedEventOf } from "../../../helpers/server-model-event-filter.helper";
import { IEvent } from "../../../../shared/interfaces/interface.event";
import { $DANGER } from "../../../../shared/types/danger.type";
import { ModelCreatedSeo } from "../../../events/models/model-created.seo";
import { filter } from "rxjs/operators";
import { ModelUpdatedSeo } from "../../../events/models/model-updated.seo";
import { ModelDeletedSeo } from "../../../events/models/model-deleted.seo";
import { ctorName } from "../../../../shared/helpers/ctor-name.helper";

export class SeModelEventHandlerMetadata<M extends IModel> implements IActionableMetadata {
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
    const handle = async (evt: IEvent) => {
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
        .get(ServerEventStream)
        .of(ModelCreatedSeo)
        .pipe(filter(serverModelCreatedEventOf(this._opts.TargetModelCtor)))
        .subscribe(handle);
    }

    else if (this._opts.type === 'updated') {
      Container
        .get(ServerEventStream)
        .of(ModelUpdatedSeo)
        .pipe(filter(serverModelUpdatedEventOf(this._opts.TargetModelCtor)))
        .subscribe(handle);
    }

    else if (this._opts.type === 'deleted') {
      Container
        .get(ServerEventStream)
        .of(ModelDeletedSeo)
        .pipe(filter(serverModelDeletedEventOf(this._opts.TargetModelCtor)))
        .subscribe(handle);
    }

    else {
      this
        .#log
        .warn(`Unhandled option type "${this._opts.type}"`);
    }
  }
}
