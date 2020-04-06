import './session-list.css';
import classnames from 'classnames';
import React, { useContext } from 'react';
import { DataContext } from '../providers/data.provider';
import { HMS } from './hms';

export const SessionList: React.FC = function SessionList() {
  const dataCtx = useContext(DataContext);

  console.log('RENDERING SESSION LIST', dataCtx.state.cache.sessions, dataCtx.state.cache.users);

  return (
    <div className="session-list">
      {dataCtx.state.cache.sessions.ids.map(id => {
        const session = dataCtx.state.cache.sessions.byId[id];
        const user = session.user_id ? dataCtx.state.cache.users.byId[session.user_id] : null;
        return (
          <div key={id} className="session">
            <HMS date={session.connected_at} />
            <span className={classnames('user-name', user?.colour ?? 'black')}>
              {user?.user_name || 'Anonymous'}
            </span>
          </div>
        )
      })}
    </div>
  );
}