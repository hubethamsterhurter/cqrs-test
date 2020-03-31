import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as op from 'rxjs/operators';
import { WsContext } from './ws-provider';
import { Subscription } from 'rxjs';
import { ofServerMessage } from '../../server/helpers/server-server-message-event-filter.helper';
import { Logger } from '../../shared/helpers/class-logger.helper';
import { ServerMessageAuthenticated } from '../../shared/domains/session/smo/authenticated.smo';
import { LoggedOutSmo } from '../../shared/domains/session/smo/logged-out.smo';
import { LOCAL_STORAGE_AUTH_KEY } from '../constants/ls-auth-key.constant';
import { ReAuthenticateCmDto } from '../../shared/domains/session/cmo/re-authenticate.cmo';
import { Trace } from '../../shared/helpers/Tracking.helper';
import { ReAuthenticateCmo } from '../../shared/message-client/models/re-authenticate.cmo';
import { InvalidReauthTokenSmo } from '../../shared/domains/session/smo/invalid-reauth-token.smo';
import { UserModel } from '../../shared/domains/user/user.model';


type AppAuthContextValue =
  | { state: 'authenticating', user: null }
  | { state: 'authenticated', user: UserModel }
  | { state: 'unauthenticated', user: null }

const initialAppAuthContext: AppAuthContextValue = {
  state: 'unauthenticated',
  user: null,
};
export const AppAuthContext = createContext<AppAuthContextValue>(initialAppAuthContext);
const _log = new Logger('AppAuthProvider');

/**
 * @description
 * AppAuthProvider
 * 
 * @param props
 */
export const AppAuthProvider: React.FC<{ children: ReactNode }> = function AppAuthProvider(props) {
  const wsCtx = useContext(WsContext);
  const [appAuth, setAppAuth] = useState<AppAuthContextValue>(initialAppAuthContext);

  useEffect(() => void _log.info('AppAuth changed:', appAuth), [appAuth]);

  // try to reauthenticate on bootup
  useEffect(() => {
    const authToken = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (authToken) {
      setAppAuth({ state: 'authenticating', user: null });
      wsCtx.send(new ReAuthenticateCmo({
        dto: new ReAuthenticateCmDto({ auth_token_id: authToken, }),
        trace: new Trace(),
      }));
    }
    // setAp
  }, []);

  useEffect(() => {
    const subs: Subscription[] = [];

    // on auth token invalid
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(InvalidReauthTokenSmo)))
      .subscribe(message => {
        const currentToken = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        const invalidToken = message.invalidTokenId;
        if (currentToken === invalidToken) {
          localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
          setAppAuth({
            state: 'unauthenticated',
            user: null,
          });
        }
      })
    );

    // on authenticate
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(ServerMessageAuthenticated)))
      .subscribe(message => {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, message.token.id);
        setAppAuth({
          state: 'authenticated',
          user: message.you,
        });
      })
    );

    // on log-out
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(LoggedOutSmo)))
      .subscribe(message => {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
        setAppAuth({
          state: 'unauthenticated',
          user: null,
        });
      })
    );

    return () => {
      subs.forEach(sub => sub.unsubscribe());
    }
  }, []);

  return (
    <AppAuthContext.Provider value={appAuth}>
      {props.children}
    </AppAuthContext.Provider>
  );
}