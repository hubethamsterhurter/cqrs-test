import React, { createContext, useState, useEffect } from 'react';
import { Subscription } from 'rxjs';
import { WsConnection, WsState } from '../modules/ws-connection';
import { Logger } from '../../shared/helpers/class-logger.helper';


interface WsCtx extends Pick<WsConnection,
  | 'state$'
  | 'delta$'
  | 'open$'
  | 'close$'
  | 'error$'
  | 'rawMessage$'
  | 'message$'
  | 'messageInvalid$'
  | 'messageMalformed$'
  | 'messageUnhandled$'
  | 'send'
  | 'messageOf$'
> {
  state: WsState,
}


export const WsContext = createContext<WsCtx>(null!);
const _log = new Logger('WsProvider');


export const WsProvider: React.FC<{ wsConnection: WsConnection }> = function WsProvider(props) {
  const [wsCtx, setWsCtx] = useState<WsCtx>(() => {
    const ctx: WsCtx = ({
      state: props.wsConnection.state$.getValue(),
      state$: props.wsConnection.state$,
      delta$: props.wsConnection.delta$,
      open$: props.wsConnection.open$,
      close$: props.wsConnection.close$,
      error$: props.wsConnection.error$,
      rawMessage$: props.wsConnection.rawMessage$,
      message$: props.wsConnection.message$,
      messageInvalid$: props.wsConnection.messageInvalid$,
      messageMalformed$: props.wsConnection.messageMalformed$,
      messageUnhandled$: props.wsConnection.messageUnhandled$,
      send: props.wsConnection.send.bind(props.wsConnection),
      messageOf$: props.wsConnection.messageOf$.bind(props.wsConnection),
    });
    return ctx;
  });

  useEffect(() => {
    const subs: Subscription[] = [];
    subs.push(wsCtx.state$.subscribe(state => setWsCtx((prev): WsCtx => ({...prev, state: state }) )));
    subs.push(wsCtx.message$.subscribe(message => _log.info('received message', message)));
    return () => subs.forEach(sub => sub.unsubscribe());
  }, []);

  // wsContextValue.
  return (
    <WsContext.Provider value={wsCtx}>
      {props.children}
    </WsContext.Provider>
  );
}
