import * as op from 'rxjs/operators'; 
import React, { createContext } from 'react';
import { ClientMessageParser } from '../../shared/message-client/modules/client-message-parser';
import { ClientMessage } from '../../shared/message-client/modules/client-message-registry';
import { ServerMessage } from '../../shared/message-server/modules/server-message-registry';
import { ServerMessageParser } from '../../shared/message-server/modules/server-message-parser';
import { MessageParseResponse } from '../../shared/helpers/message-parser.helper';
import { Subject, Observable } from 'rxjs';
import { ValidationError } from 'class-validator';
import { ClassLogger } from '../../shared/helpers/class-logger.helper';

// const messageStream = Subject

const clientMsgParser = new ClientMessageParser();
const serverMsgParser = new ServerMessageParser();

const ws = new WebSocket('ws://localhost:5500');

type WsState =
  | WebSocket['CLOSED']
  | WebSocket['CLOSING']
  | WebSocket['CONNECTING']
  | WebSocket['OPEN'];


let wsPrevState: WsState = ws.readyState;


const wsStateChangeSubj = new Subject<{ old: WsState, new: WsState }>();
const wsOpenSubj = new Subject<Event>();
const wsCloseSubj = new Subject<CloseEvent>();
const wsMessageSubj = new Subject<MessageEvent>();
const wsErrorSubj = new Subject<Event>();

ws.onopen = function onWsOpen(this: WebSocket, openEvt) {
  if (this.readyState !== wsPrevState) {
    wsStateChangeSubj.next({ old: wsPrevState, new: this.readyState });
    wsPrevState = this.readyState;
  }
  wsOpenSubj.next(openEvt);
}

ws.onclose = function onWsClose(this: WebSocket, closeEvt: CloseEvent) {
  if (this.readyState !== wsPrevState) {
    wsStateChangeSubj.next({ old: wsPrevState, new: this.readyState });
    wsPrevState = this.readyState;
  }
  wsCloseSubj.next(closeEvt);
}

ws.onmessage = function onWsMessage(this: WebSocket, messageEvt: MessageEvent) {
  if (this.readyState !== wsPrevState) {
    wsStateChangeSubj.next({ old: wsPrevState, new: this.readyState });
    wsPrevState = this.readyState;
  }
  wsMessageSubj.next(messageEvt);
}

ws.onerror = function wsOnError(this: WebSocket, errorEvt: Event) {
  if (this.readyState !== wsPrevState) {
    wsStateChangeSubj.next({ old: wsPrevState, new: this.readyState });
    wsPrevState = this.readyState;
  }
  wsErrorSubj.next(errorEvt);
}

const stateChange$ = new Observable<{ old: WsState, new: WsState }>(function subscribe(subscriber) {
  const subscription = wsStateChangeSubj.subscribe((stateDelta) => subscriber.next(stateDelta));
  return { unsubscribe() { subscription.unsubscribe() } };
});

const open$ = new Observable<Event>(function subscribe(subscriber) {
  const subscription = wsOpenSubj.subscribe((evt) => subscriber.next(evt));
  return { unsubscribe() { subscription.unsubscribe() } };
});

const close$ = new Observable<CloseEvent>(function subscribe(subscriber) {
  const subscription = wsCloseSubj.subscribe((evt) => subscriber.next(evt));
  return { unsubscribe() { subscription.unsubscribe() } };
});

const rawMessage$ = new Observable<MessageEvent>(function subscribe(subscriber) {
  const subscription = wsMessageSubj.subscribe((evt) => subscriber.next(evt));
  return { unsubscribe() { subscription.unsubscribe() } };
});

const error$ = new Observable<Event>(function subscribe(subscriber) {
  const subscription = wsErrorSubj.subscribe((evt) => subscriber.next(evt));
  return { unsubscribe() { subscription.unsubscribe() } };
});

const messageParse$ = new Observable<MessageParseResponse<ServerMessage>>(function subscribe(subscriber) {
  const subscription = wsMessageSubj.subscribe((evt) => {
    const parsed = serverMsgParser.fromString(String(evt.data));
    subscriber.next(parsed);
  });
  return { unsubscribe() { subscription.unsubscribe(); } }
});

const message$ = new Observable<ServerMessage>(function subscribe(subscriber) {
  const subscription = messageParse$.subscribe(messageParse => {
    if (messageParse.status === 'success') { subscriber.next(messageParse.message) }
  });
    return { unsubscribe() { subscription.unsubscribe(); } }
});

const messageInvalid$ = new Observable<ValidationError[]>(function subscribe(subscriber) {
  const subscription = messageParse$.subscribe(messageParse => {
    if (messageParse.status === 'invalid') { subscriber.next(messageParse.errs) };
    return { unsubscribe() { subscription.unsubscribe(); } }
  });
});

const messageMalformed$ = new Observable<Error>(function subscribe(subscriber) {
  const subscription = messageParse$.subscribe(messageParse => {
    if (messageParse.status === 'malformed') { subscriber.next(messageParse.err); };
    return { unsubscribe() { subscription.unsubscribe(); } }
  });
});

const _log = new ClassLogger('WsProvider');

// rawMessage$.subscribe(evt => _log.info('received raw message:', evt.data));
message$.subscribe(message => _log.info('Received message', message));
messageInvalid$.subscribe(errors => _log.info('Received invalid message', errors));
messageMalformed$.subscribe(error => _log.info('Received malformed message', error));



function send(msg: ClientMessage): void {
  // TODO: check state
  const strMsg = JSON.stringify(msg);
  _log.info('Sending Message', msg);
  ws.send(strMsg);
}



interface WsContextValue {
  send(msg: ClientMessage): void;
  stateChange$: Observable<{ old: WsState, new: WsState }>;
  open$: Observable<Event>;
  close$: Observable<CloseEvent>;
  error$: Observable<Event>;
  message$: Observable<ServerMessage>;
  messageInvalid$: Observable<ValidationError[]>;
  messageMalformed$: Observable<Error>;
}



const wsContextValue: WsContextValue = {
  send,
  stateChange$,
  close$,
  error$,
  message$,
  open$,
  messageInvalid$,
  messageMalformed$
}


export const WsContext = createContext<WsContextValue>(wsContextValue);


export const WsProvider: React.FC = function WsProvider(props) {
  return (
    <WsContext.Provider value={wsContextValue}>
      {props.children}
    </WsContext.Provider>
  );
}
