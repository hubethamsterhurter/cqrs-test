import React, { createContext, useContext, useEffect, useState } from 'react';
import * as op from 'rxjs/operators';
import { UserModel } from '../../shared/domains/user/user.model';
import { WsContext } from './ws-provider';
import { Subscription } from 'rxjs';
import { ofServerMessage } from '../../server/helpers/server-server-message-event-filter.helper';
import { ClassLogger } from '../../shared/helpers/class-logger.helper';
import { ServerMessageAuthenticated } from '../../shared/message-server/models/server-message.authenticated';
import { ServerMessageLoggedOut } from '../../shared/message-server/models/server-message.logged-out';


interface AppAuthContextValue { user_id: UserModel['id'] | null; authenticated: boolean }
const initialAppAuthContext: AppAuthContextValue = { user_id: null, authenticated: false };
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
  const [appAuth, setAppAuth] = useState(initialAppAuthContext);

  useEffect(() => void _log.info('AppAuth changed:', appAuth), [appAuth]);

  useEffect(() => {
    const subs: Subscription[] = [];

    // authenticate
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(ServerMessageAuthenticated)))
      .subscribe(message => {
        setAppAuth({
          user_id: message.you.id,
          authenticated: true,
        });
      })
    );

    // log-out
    subs.push(wsCtx
      .message$
      .pipe(op.filter(ofServerMessage(ServerMessageLoggedOut)))
      .subscribe(message => {
        setAppAuth({
          user_id: null,
          authenticated: false,
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