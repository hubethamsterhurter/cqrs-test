import React, { createContext, useContext, useEffect, useState } from 'react';
import * as op from 'rxjs/operators';
import { WsContext } from './ws-provider';
import { Subscription } from 'rxjs';
import { ofServerMessage } from '../../server/helpers/server-server-message-event-filter.helper';
import { ClassLogger } from '../../shared/helpers/class-logger.helper';
import { ServerMessageAuthenticated } from '../../shared/message-server/models/server-message.authenticated';
import { ServerMessageLoggedOut } from '../../shared/message-server/models/server-message.logged-out';
import { LOCAL_STORAGE_AUTH_KEY } from '../constants/ls-auth-key.constant';
import { ReAuthenticateDto } from '../../shared/domains/session/dto/re-authenticate.dto';
import { Trace } from '../../shared/helpers/Tracking.helper';
import { ReAuthenticateCmo } from '../../shared/message-client/models/re-authenticate.cmo';


type AppAuthContextValue =
  | { state: 'authenticating', user_id: null }
  | { state: 'authenticated', user_id: string }
  | { state: 'unauthenticated', user_id: null }

const initialAppAuthContext: AppAuthContextValue = {
  state: 'unauthenticated',
  user_id: null,
};
export const AppAuthContext = createContext<AppAuthContextValue>(initialAppAuthContext);
const _log = new ClassLogger('AppAuthProvider');

/**
 * @description
 * AppAuthProvider
 * 
 * @param props
 */
export const AppAuthProvider: React.FC<{ children: (props: AppAuthContextValue) => React.ReactNode }> = function AppAuthProvider(props) {
  const wsCtx = useContext(WsContext);
  const [appAuth, setAppAuth] = useState<AppAuthContextValue>(initialAppAuthContext);

  useEffect(() => void _log.info('AppAuth changed:', appAuth), [appAuth]);
  useEffect(() => {
    const authToken = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (authToken) {
      setAppAuth({ state: 'authenticating', user_id: null });
      wsCtx.send(new ReAuthenticateCmo({
        dto: new ReAuthenticateDto({ auth_token_id: authToken, }),
        trace: new Trace(),
      }));
    }
    // setAp
  }, []);

  useEffect(() => {
    const subs: Subscription[] = [];

    // authenticate
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(ServerMessageAuthenticated)))
      .subscribe(message => {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, message.token.id);
        setAppAuth({
          state: 'authenticated',
          user_id: message.you.id,
        });
      })
    );

    // log-out
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(ServerMessageLoggedOut)))
      .subscribe(message => {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
        setAppAuth({
          state: 'unauthenticated',
          user_id: null,
        });
      })
    );

    return () => {
      subs.forEach(sub => sub.unsubscribe());
    }
  }, []);

  return (
    <AppAuthContext.Provider value={appAuth}>
      {props.children(appAuth)}
    </AppAuthContext.Provider>
  );
}