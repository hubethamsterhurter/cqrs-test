import { merge, BehaviorSubject } from "rxjs";
import { WsConnection } from "./ws-connection";
import { InitSmo } from "../../shared/smo/init.smo";
import { ModelCreatedSmo } from "../../shared/smo/model.created.smo";
import { Logger } from "../../shared/helpers/class-logger.helper";
import { ModelUpdatedSmo } from "../../shared/smo/mode.updated.smo";
import { ModelDeletedSmo } from "../../shared/smo/model.deleted.smo";
import * as op from "rxjs/operators";
import { DataState, initialDataCtx, dataReducer } from "./data.state";
import { IMessage } from "../../shared/interfaces/interface.message";



let __created__ = false;
export class Data {
  readonly #log = new Logger(this);
  get state() { return this.state$.getValue(); }
  readonly state$: BehaviorSubject<DataState> = new BehaviorSubject(initialDataCtx);


  /**
   * @constructor
   *
   * @param _connection
   */
  constructor(private readonly _connection: WsConnection) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    const self = this;
    if (window) { Object.defineProperty(window, '_DATA', { get() { return self.state$.getValue(); } }) };

    merge(
      _connection.messageOf$(InitSmo),
      _connection.messageOf$(ModelCreatedSmo),
      _connection.messageOf$(ModelUpdatedSmo),
      _connection.messageOf$(ModelDeletedSmo),
    ).pipe(
      op.scan<IMessage, DataState>((prev, action): DataState => dataReducer(prev, action), initialDataCtx,),
      op.distinctUntilChanged(),
      op.share(),
    ).subscribe(result => this.state$.next(result!));
  }
}
