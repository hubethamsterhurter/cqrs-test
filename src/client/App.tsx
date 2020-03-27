import React from 'react';
import './App.css';
import { WsProvider } from './components/ws-provider';
import { AppStateDataProvider } from './components/app-state-data-provider';
import { ChatSection } from './components/chat-section';
import { SignupPage } from './components/signup-form';
import { AppAuthProvider } from './components/app-auth-provider';
import { ClientList } from './components/client-list';

function App() {
  return (
    <div className="App">
      <WsProvider>
        <AppStateDataProvider>
          <AppAuthProvider>
            {({ authenticated }) => (
              <>
                {authenticated && (
                  <>
                    <ClientList />
                    <ChatSection />
                  </>
                )}
                {!authenticated && (
                  <>
                    <SignupPage />
                  </>
                )}
              </>
            )}
          </AppAuthProvider>
        </AppStateDataProvider>
      </WsProvider>
    </div>
  );
}

export default App;
