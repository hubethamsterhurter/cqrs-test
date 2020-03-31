import React from 'react';
import { NewChat } from './new-chat';
import { ChatHistory } from './chat-history';

export const ChatSection: React.FC = function ChatSection(props) {
  return (
    <>
      <ChatHistory />
      <NewChat />
    </>
  )
}