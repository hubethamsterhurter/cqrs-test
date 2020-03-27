import React, { createContext, useContext, useEffect, useState } from 'react';
import * as op from 'rxjs/operators';
import { UserModel } from '../../shared/domains/user/user.model';
import { ChatModel } from '../../shared/domains/chat/chat.model';
import { WsContext } from './ws-provider';
import { Subscription } from 'rxjs';
import { ofServerMessage } from '../../server/helpers/server-server-message-event-filter.helper';
import { ServerMessageUserCreated } from '../../shared/message-server/models/server-message.user.created';
import { ServerMessageUserUpdated } from '../../shared/message-server/models/server-message.user.updated';
import { ServerMessageChatCreated } from '../../shared/message-server/models/server-message.chat.created';
import { ServerMessageInit } from '../../shared/message-server/models/server-message.init';
import { ClassLogger } from '../../shared/helpers/class-logger.helper';


interface AppStateDataContextValue {
  chats: {
    byId: Record<string, ChatModel>;
    ids: string[],
  };
  users: {
    byId: Record<string, UserModel>;
    ids: string[],
  };
}

const initialAppStateDataContext: AppStateDataContextValue = {
  chats: {
    byId: {},
    ids: [],
  },
  users: {
    byId: {},
    ids: [],
  },
};

export const AppStateDataContext = createContext<AppStateDataContextValue>(initialAppStateDataContext);


const _log = new ClassLogger('AppStateDataProvider');

export const AppStateDataProvider: React.FC = function AppStateDataProvider(props) {
  const wsCtx = useContext(WsContext);
  const [appStateData, setAppStateData] = useState(initialAppStateDataContext);

  useEffect(() => void _log.info('AppStateData changed:', appStateData), [appStateData]);

  useEffect(() => {
    const subs: Subscription[] = [];

    // init (reset)
    subs.push(wsCtx.message$.pipe(op.filter(ofServerMessage(ServerMessageInit)))
      .subscribe(message => setAppStateData(prev => ({
        ...initialAppStateDataContext,
        chats: {
          byId: Object.fromEntries(message.chats.map(chat => [chat.id, chat] as const)),
          ids: message.chats.map(chat => chat.id),
        },
        users: {
          byId: Object.fromEntries(message.users.map(chat => [chat.id, chat] as const)),
          ids: message.users.map(chat => chat.id),
        },
      }))
    ));

    // users created
    subs.push(wsCtx.message$.pipe(op.filter(ofServerMessage(ServerMessageUserCreated)))
      .subscribe(message => setAppStateData(prev => {
        const next = ({ ...prev, users: {
          ...prev.users,
          byId: { ...prev.users.byId, [message.model.id]: message.model, },
          ids: message.model.id in prev.users.ids ? prev.users.ids : prev.users.ids.concat(message.model.id),
        }});
        _log.info(`Updating from ${ServerMessageUserCreated.name}`, { prev, next });
        return next;
      }
    )));

    // users updated
    subs.push(wsCtx.message$.pipe(op.filter(ofServerMessage(ServerMessageUserUpdated)))
      .subscribe(message => setAppStateData(prev => {
        const next = ({ ...prev, users: {
          ...prev.users,
          byId: { ...prev.users.byId, [message.model.id]: message.model, },
          ids: message.model.id in prev.users.ids ? prev.users.ids : prev.users.ids.concat(message.model.id),
        }});
        _log.info(`Updating from ${ServerMessageUserUpdated.name}`, { prev, next });
        return next;
      }
    )));

    // chats created
    subs.push(wsCtx.message$.pipe(op.filter(ofServerMessage(ServerMessageChatCreated)))
      .subscribe(message => setAppStateData(prev => {
        const next = ({ ...prev, chats: {
          ...prev.chats,
          byId: { ...prev.chats.byId, [message.model.id]: message.model, },
          ids: message.model.id in prev.chats.ids ? prev.chats.ids : prev.chats.ids.concat(message.model.id),
        }})
        _log.info(`Updating from ${ServerMessageChatCreated.name}`, { prev, next });
        return next;
      }
    )));


    return () => {
      subs.forEach(sub => sub.unsubscribe());
    }
  }, []);

  return (
    <AppStateDataContext.Provider value={appStateData}>
      {props.children}
    </AppStateDataContext.Provider>
  );
}