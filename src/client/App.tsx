import React from 'react';
import './App.css';
import { WsProvider } from './components/ws-provider';
import { AppStateDataProvider } from './components/app-state-data-provider';
import { ChatSection } from './components/chat-section';
import { UserForm } from './components/user-form';

function App() {
  return (
    <div className="App">
      <WsProvider>
        <AppStateDataProvider>
          <UserForm />
          <ChatSection />
        </AppStateDataProvider>
      </WsProvider>
    </div>
  );
}

export default App;
