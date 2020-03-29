import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { WsProvider } from './components/ws-provider';
import { AppStateDataProvider } from './components/app-state-data-provider';
import { ChatSection } from './components/chat-section';
import { SignupPage } from './components/signup-page';
import { AppAuthProvider } from './components/app-auth-provider';
import { SessionList } from './components/session-list';
import { AlertContainer } from './components/alert-container';

function App() {
  return (
    <div className="App">
      <WsProvider>
        <AppStateDataProvider>
          <AppAuthProvider>
            {({ authenticated }) => 
              (
                <>
                  {authenticated && (
                    <>
                      <SessionList />
                      <ChatSection />
                    </>
                  )}
                  {!authenticated && (
                    <>
                      <SignupPage />
                    </>
                  )}
                  <AlertContainer />
                </>
              )
            }
          </AppAuthProvider>
        </AppStateDataProvider>
      </WsProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
