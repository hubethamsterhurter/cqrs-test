import * as opt from 'fp-ts/lib/Option';
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Subscription } from 'rxjs';
import { Logger } from '../../shared/helpers/class-logger.helper';
import { Auth, AuthState } from '../modules/auth';


interface AuthCtx extends Pick<Auth,
  | 'state$'
  | 'signUp'
  | 'login'
  | 'logout'
  // | 'isAuthenticated'
  // | 'isAuthenticating'
  // | 'isUnauthenticated'
  > {
  readonly state: AuthState,
  readonly isAuthenticating: boolean,
  readonly isAuthenticated: boolean,
  readonly isUnauthenticated: boolean,
}

export const AuthContext = createContext<AuthCtx>(null!);
const _log = new Logger('AuthProvider');

/**
 * @description
 * AppAuthProvider
 * 
 * @param props
 */
export const AuthProvider: React.FC<{ auth: Auth }> = function AppAuthProvider(props) {
  const [authCtx, setAuthCtx] = useState<AuthCtx>(() => {
    const val: AuthCtx = ({
      state: props.auth.state$.getValue(),
      state$: props.auth.state$,
      signUp: props.auth.signUp.bind(props.auth),
      login: props.auth.login.bind(props.auth),
      logout: props.auth.logout.bind(props.auth),
      isAuthenticated: opt.isSome(props.auth.isAuthenticated()),
      isUnauthenticated: opt.isSome(props.auth.isUnauthenticated()),
      isAuthenticating: opt.isSome(props.auth.isAuthenticating()),
    });
    return val;
  });

  useEffect(() => {
    const subs: Subscription[] = [];
    subs.push(authCtx.state$.subscribe((state)=> setAuthCtx((prev): AuthCtx => ({
      ...prev,
      isAuthenticated: Auth.isAuthenticated(state),
      isAuthenticating: Auth.isAuthenticating(state),
      isUnauthenticated: Auth.isUnauthenticated(state),
      state,
    }))))
    return () => subs.forEach(sub => sub.unsubscribe());
  }, [])

  return (
    <AuthContext.Provider value={authCtx}>
      {props.children}
    </AuthContext.Provider>
  );
}