import * as op from 'rxjs/operators';
import classnames from 'classnames';
import './chat-history.css';
import React, { useContext, useLayoutEffect, useState, useRef, useEffect } from 'react';
import { DataCtx } from './app-state-data-provider';
import { UserModel } from '../../shared/domains/user/user.model';
import { USER_COLOUR } from '../../shared/constants/user-colour';
import { HMS } from './hms';


export const ChatHistory: React.FC = function ChatHistory(props) {
  const dataCtx = useContext(DataCtx);
  const [forceScrollBottom, setForceScrollBottom] = useState(true);
  const chatsRef = useRef<HTMLDivElement>(null);

  /**
   * @description
   * Handle scroll event
   * 
   * @param evt 
   */
  function handleScroll(evt: React.UIEvent<HTMLDivElement>) {
    // https://stackoverflow.com/questions/876115/how-can-i-determine-if-a-div-is-scrolled-to-the-bottom
    const atBottom = evt.currentTarget.scrollHeight <= (evt.currentTarget.scrollTop + evt.currentTarget.offsetHeight);
    if (atBottom && !forceScrollBottom) { setForceScrollBottom(true); }
    else if (!atBottom && forceScrollBottom) { setForceScrollBottom(false); }
  }

  useEffect(() => { console.log('scrollBottom changed:', forceScrollBottom); }, [forceScrollBottom]);

  useLayoutEffect(() => {
    if (forceScrollBottom && chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight + chatsRef.current.clientHeight;
    }
  }, [ dataCtx.chats.byId, forceScrollBottom, chatsRef, ]);


  return (
    <div ref={chatsRef} onScroll={handleScroll} className="chat-history">
      {dataCtx.chats.ids.map((chatId: string) => {
        const chat = dataCtx.chats.byId[chatId];
        const author: UserModel | null = chat.author_id ? dataCtx.users.byId[chat.author_id] : null;
        const authorName = author?.user_name ?? 'Anonymous';
        const colour = author?.colour ?? USER_COLOUR.BLACK;
        return (
          <div key={chat.id}>
            <HMS className="sent-at" date={chat.sent_at} />
            <span className={classnames("user-name", `${colour}`)}>{authorName}</span>
            <span className="content">{chat.content}</span>
          </div>
        )}
      )}
    </div>
  );
}