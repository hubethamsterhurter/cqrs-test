import { ClassType } from "class-transformer/ClassTransformer";
import { IMessage } from "../../../../shared/interfaces/interface.message";
import { Constructor } from "../../../../shared/types/constructor.type";
import { IActionableMetadata } from "../interface.actionable-metadata";
import { Logger } from "../../../../shared/helpers/class-logger.helper";
import { Prototype } from "../../../../shared/types/prototype.type";
import Container from "typedi";
import { ServerEventStream } from "../../event-stream/server-event-stream";
import { SCMessageSeo } from "../../../events/models/sc.message-parsed.seo";
import { filter } from "rxjs/operators";
import { ofClientMessage } from "../../../helpers/of-client-message.helper";
import { ctorName } from "../../../../shared/helpers/ctor-name.helper";
import { $DANGER } from "../../../../shared/types/danger.type";
import { ErrorSmo, ErrorSmDto } from "../../../../shared/smo/error.smo";
import { HTTP_CODE } from "../../../../shared/constants/http-code.constant";

export class CmHandlerMetadata<M extends IMessage> implements IActionableMetadata {
  #log = new Logger(this);

  /**
   * @constructor
   *
   * @param arg
   */
  constructor(private _opts: {
    readonly TargetCmCtor: ClassType<M>,
    readonly HostCtor: Constructor,
    readonly prototype: Prototype,
    readonly propertyKey: PropertyKey,
    readonly descriptor: PropertyDescriptor,
  }) {
    //
  }

  /** @inheritdoc */
  action(arg: {
    instance: M
  }): void {
    this
      .#log
      .info([
        `${ctorName(this)} ] Binding`,
        ` ${this._opts.HostCtor.name}.${this._opts.propertyKey.toString()}`,
        ` to "${SCMessageSeo.name}" of type "${this._opts.TargetCmCtor.name}"`,
      ].join(''));

    /**
     * @description
     * Handle a client message
     *
     * @param evt
     */
    const handle = async (evt: SCMessageSeo) => {
      try {
        const method: Function = (arg.instance as $DANGER<any>)[this._opts.propertyKey];
        await method.call(arg.instance, evt);
      } catch (err) {
        if (err instanceof Error) {
          evt.dto.socket.send(new ErrorSmo({
            dto: new ErrorSmDto({
              code: HTTP_CODE._500,
              message: `${err.name}: ${err.message}`,
              trace: evt.trace.clone(),
            }),
            trace: evt.trace.clone(),
          }))
        } else {
          this
            .#log
            .error('UNHANDLED Client Message Handler Error', err);
        }
      }
    }

    Container
      .get(ServerEventStream)
      .of(SCMessageSeo)
      .pipe(filter(ofClientMessage(this._opts.TargetCmCtor)))
      .subscribe(handle);
  }
}
