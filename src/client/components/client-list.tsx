import classnames from 'classnames';
import React, { useContext } from 'react';
import { AppStateDataContext } from './app-state-data-provider';

export const ClientList: React.FC = function ClientList() {
  const dataCtx = useContext(AppStateDataContext);

  return (
    <div className="client-list">
      {dataCtx.clients.ids.map(id => {
        const client = dataCtx.clients.byId[id];
        const user = client.user_id ? dataCtx.users.byId[client.user_id] : null;
        return (
          <div key={id} className="client">
            <span>{client.connected_at.toISOString()}</span>
            <span className={classnames('user-name', user?.colour ?? 'black')}>
              {user?.user_name || 'Anonymous'}
            </span>
          </div>
        )
      })}
    </div>
  );
}