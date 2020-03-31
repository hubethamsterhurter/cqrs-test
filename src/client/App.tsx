import React, { useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { WsProvider, WsContext } from './components/ws-provider';
import { DataCtxProvider } from './components/app-state-data-provider';
import { ChatSection } from './components/chat-section';
import { SignupPage } from './components/signup-page';
import { AppAuthProvider, AppAuthContext } from './components/app-auth-provider';
import { SessionList } from './components/session-list';
import { AlertContainer } from './components/alert-container';

function App() {
  return (
    <div className="App">
      <WsProvider>
        <AlertContainer />
        <WsContext.Consumer>
          {(wsCtx) => {
            if (wsCtx.wsState === WebSocket.CLOSED) {
              return <div>ws closed...</div>
            }

            if (wsCtx.wsState === WebSocket.CLOSING) {
              return <div>ws closing...</div>
            }

            if (wsCtx.wsState === WebSocket.CONNECTING) {
              return <div>ws connecting...</div>
            }

            if (wsCtx.wsState === WebSocket.OPEN) {
              return (
                <DataCtxProvider>
                  <AppAuthProvider>
                    <AppAuthContext.Consumer>
                      {(authCtx) => {
                        if (authCtx.state === 'authenticated') {
                          return (
                            <>
                              <SessionList />
                              <ChatSection />
                            </>
                          );
                        }

                        if (authCtx.state === 'authenticating') {
                          return (
                            <>
                              <div>...Authenticating...</div>
                            </>
                          )
                        }

                        if (authCtx.state === 'unauthenticated') {
                          return (
                            <>
                              <SignupPage />
                            </>
                          )
                        }
                      }}
                    </AppAuthContext.Consumer>
                  </AppAuthProvider>
                </DataCtxProvider>
              )
            }
          }}
        </WsContext.Consumer>
      </WsProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
