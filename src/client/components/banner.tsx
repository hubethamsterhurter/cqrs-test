import './banner.css';
import React, { useContext } from 'react';
import { AuthContext } from '../providers/auth.provider';

export const Banner: React.FC = function Banner() {
  const authCtx = useContext(AuthContext);

  const { isAuthenticated, isAuthenticating, isUnauthenticated } = authCtx;

  return (
    <nav>
      {isAuthenticated}
      {isAuthenticating}
      {isUnauthenticated}
    </nav>
  );
}