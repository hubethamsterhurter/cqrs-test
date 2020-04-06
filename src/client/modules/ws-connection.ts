import * as op from 'rxjs/operators';
import { Observable, fromEvent, BehaviorSubject } from "rxjs";
import { IMessage } from "../../shared/interfaces/interface.message";
import { ParseInvalidPayload, ParseMalformedPayload, ParseUnhandledPayload, ParseResult } from "../../shared/helpers/parse-result.helper";
import { MessageParser } from "../../shared/util/message-parser.util";
import Container from "typedi";
import { merge } from "rxjs";
import { Constructor } from '../../shared/types/constructor.type';
import { Logger } from '../../shared/helpers/class-logger.helper';
import { Delta } from '../../shared/types/delta.type';
import { LOCAL_STORAGE_AUTH_KEY } from '../constants/local-storage-auth-key.constant';

export type WsEvent =
  | Event
  | CloseEvent
  | Event
  | MessageEvent;
export type WsState =
  | WebSocket['CLOSED']
  | WebSocket['CLOSING']
  | WebSocket['CONNECTING']
  | WebSocket['OPEN'];
export type WsDelta = Delta<WsState>;


let __created__ = false;
export class WsConnection {
  readonly #log = new Logger(this);
  readonly #messageParser = Container.get(MessageParser);

  readonly ws: WebSocket;
  readonly state$: BehaviorSubject<WsState>;
  readonly delta$: Observable<WsDelta>;
  readonly open$: Observable<Event>;
  readonly close$: Observable<CloseEvent>;
  readonly error$: Observable<Event>;
  readonly rawMessage$: Observable<MessageEvent>;
  readonly message$: Observable<IMessage>;
  readonly messageInvalid$: Observable<ParseInvalidPayload<IMessage>>;
  readonly messageMalformed$: Observable<ParseMalformedPayload>;
  readonly messageUnhandled$: Observable<ParseUnhandledPayload>;



  /**
   * @constructor
   *
   * @param _url
   */
  constructor(private readonly _url: string) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;

    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) || '';

    const self = this;
    if (window) { Object.defineProperty(window, '_WS', { get() { return self.state$.getValue(); } }) };

    const ws = new WebSocket(`${_url}` + (token ? `?auth=${token}` : ''));
    const state$ = new BehaviorSubject(ws.readyState);

    const open$ = fromEvent<Event>(ws, 'open');
    const close$ = fromEvent<CloseEvent>(ws, 'close');
    const rawMessage$ = fromEvent<MessageEvent>(ws, 'message');
    const error$ = fromEvent<Event>(ws, 'error');

    open$.subscribe(evt => console.log('OPEN FOR BUSINESS'));
    close$.subscribe(evt => console.log('CLOSE$'));
    error$.subscribe(evt => console.log('ERROR$'));
    rawMessage$.subscribe(evt => console.log('RAW MESSAGE'));

    const delta$ = merge(open$, close$, rawMessage$, error$).pipe(op.scan<WsEvent, WsDelta>(
      (acc, value, index) => {
        const result = ({ old: acc.new, new: ws.readyState, });
        return result;
      },
      { new: ws.readyState, old: ws.readyState, }
    ), op.share(),);

    delta$.pipe(op.map(delta => delta.new)).subscribe(state => this.state$.next(state));

    // share the messageParse$ results
    const messageParse$: Observable<ParseResult<IMessage>> = rawMessage$.pipe(
      op.map((evt: MessageEvent) => this.#messageParser.fromString(evt.data)),
      op.share(),
    );

    const message$: Observable<IMessage> = messageParse$.pipe(
      op.filter(ParseResult.success),
      op.map(pload => pload._u.instance),
      op.share(),
    );

    const messageInvalid$: Observable<ParseInvalidPayload<IMessage>> = messageParse$.pipe(
      op.filter(ParseResult.invalid),
      op.map(pload => pload._u),
      op.share(),
    );

    const messageMalformed$: Observable<ParseMalformedPayload> = messageParse$.pipe(
      op.filter(ParseResult.malformed),
      op.map(pload => pload._u),
      op.share(),
    );

    const messageUnhandled$: Observable<ParseUnhandledPayload> = messageParse$.pipe(
      op.filter(ParseResult.unhandled),
      op.map(pload => pload._u),
      op.share(),
    );

    this.close$ = close$;
    this.error$ = close$;
    this.message$ = message$;
    this.messageInvalid$ = messageInvalid$;
    this.messageMalformed$ = messageMalformed$;
    this.messageUnhandled$ = messageUnhandled$;
    this.open$ = open$;
    this.rawMessage$ = rawMessage$;
    this.delta$ = delta$;
    this.state$ = state$;
    this.ws = ws;
  }



  /**
   * @description
   * Retrieve messages of type
   *
   * @param SmCtor
   */
  messageOf$<T extends IMessage>(SmCtor: Constructor<T>): Observable<T> {
    this.#messageParser.registry.add(SmCtor);
    const filtered = this.message$.pipe(op.filter(message => message instanceof SmCtor)) as Observable<T>;
    return filtered;
  }



  /**
   * @description
   * Send a message
   *
   * @param message
   */
  send(message: IMessage): void {
    // TODO: check state
    const strMsg = JSON.stringify(message);
    this.#log.info('Sending Message', message);
    this.ws.send(strMsg);
  }
}