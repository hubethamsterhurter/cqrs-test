import * as op from 'rxjs/operators';
import classnames from 'classnames';
import './chat-history.css';
import React, { useContext } from 'react';
import { AppStateDataContext } from './app-state-data-provider';
import { UserModel } from '../../shared/domains/user/user.model';
import { USER_COLOUR } from '../../shared/constants/user-colour';

export const ChatHistory: React.FC = function ChatHistory(props) {
  const dataCtx = useContext(AppStateDataContext);

  return (
    <div className="chat-history">
      {dataCtx.chats.ids.map((chatId: string) => {
        const chat = dataCtx.chats.byId[chatId];
        const author: UserModel | null = chat.author_id ? dataCtx.users.byId[chat.author_id] : null;
        const authorName = author?.user_name ?? 'Anonymous';
        const colour = author?.colour ?? USER_COLOUR.BLACK;
        return (
          <div key={chat.id}>
            <span className="sent-at">{[
              chat.sent_at.getHours().toString().padStart(2, '0'),
              chat.sent_at.getMinutes().toString().padStart(2, '0'),
              chat.sent_at.getSeconds().toString().padStart(2, '0'),
            ].join(':')}</span>
            <span className={classnames("user-name", `${colour}`)}>{authorName}</span>
            <span className="content">{chat.content}</span>
          </div>
        )}
      )}
    </div>
  );
}