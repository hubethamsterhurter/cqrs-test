import * as opt from 'fp-ts/lib/Option';
import React, { useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { WsProvider, WsContext } from './providers/ws.provider';
import { DataProvider } from './providers/data.provider';
import { ChatSection } from './components/chat-section';
import { SignupPage } from './components/signup-page';
import { AuthProvider, AuthContext } from './providers/auth.provider';
import { SessionList } from './components/session-list';
import { AlertContainer } from './components/alert-container';
import { WsConnection } from './modules/ws-connection';
import { Auth } from './modules/auth';
import { Data } from './modules/data';
import { LOCAL_STORAGE_AUTH_KEY } from './constants/local-storage-auth-key.constant';

const wsConection = new WsConnection(`ws://localhost:5500`);
const auth = new Auth(wsConection);
const data = new Data(wsConection);

function App() {
  return (
    <div className="App">
      <WsProvider wsConnection={wsConection}>
        <DataProvider data={data}>
          <AuthProvider auth={auth}>
            <AlertContainer />
            <WsContext.Consumer>
              {(wsCtx) => {
                if (wsCtx.state === WebSocket.CLOSED) {
                  return <div>ws closed...</div>
                }

                if (wsCtx.state === WebSocket.CLOSING) {
                  return <div>ws closing...</div>
                }

                if (wsCtx.state === WebSocket.CONNECTING) {
                  return <div>ws connecting...</div>
                }

                if (wsCtx.state === WebSocket.OPEN) {
                  return (
                    <AuthContext.Consumer>
                      {(authCtx) => {
                        if (authCtx.state.status === 'authenticated') {
                          return (
                            <>
                              <SessionList />
                              <ChatSection />
                            </>
                          );
                        }

                        if (authCtx.state.status === 'authenticating') {
                          return (
                            <>
                              <div>...Authenticating...</div>
                            </>
                          )
                        }

                        if (authCtx.state.status === 'unauthenticated') {
                          return (
                            <>
                              <SignupPage />
                            </>
                          )
                        }
                      }}
                    </AuthContext.Consumer>
                  )
                }
              }}
            </WsContext.Consumer>
          </AuthProvider>
        </DataProvider>
      </WsProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
