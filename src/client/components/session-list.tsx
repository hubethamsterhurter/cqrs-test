import './session-list.css';
import classnames from 'classnames';
import React, { useContext } from 'react';
import { DataCtx } from './app-state-data-provider';
import { HMS } from './hms';

export const SessionList: React.FC = function SessionList() {
  const dataCtx = useContext(DataCtx);

  return (
    <div className="session-list">
      {dataCtx.sessions.ids.map(id => {
        const session = dataCtx.sessions.byId[id];
        const user = session.user_id ? dataCtx.users.byId[session.user_id] : null;
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