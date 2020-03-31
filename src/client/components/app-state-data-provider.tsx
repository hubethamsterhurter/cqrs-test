import React, { createContext, useContext, useEffect, useState } from 'react';
import * as op from 'rxjs/operators';
import { UserModel } from '../../shared/domains/user/user.model';
import { ChatModel } from '../../shared/domains/chat/chat.model';
import { WsContext } from './ws-provider';
import { Subscription } from 'rxjs';
import { ofServerMessage } from '../../server/helpers/server-server-message-event-filter.helper';
import { ServerMessageUserCreated } from '../../shared/smo/models/user.created.smo';
import { ServerMessageUserUpdated } from '../../shared/smo/models/user.updated.smo';
import { ServerMessageChatCreated } from '../../shared/smo/model.created.smo';
import { InitSmo } from '../../shared/smo/init.smo';
import { Logger } from '../../shared/helpers/class-logger.helper';
import { SessionModel } from '../../shared/domains/session/session.model';
import { ServerMessageSessionUpdated } from '../../shared/smo/models/session.updated.smo';
import { ServerMessageSessionDeleted } from '../../shared/smo/models/session.deleted.smo';
import { ServerMessageSessionCreated } from '../../shared/smo/models/session.created.smo';
import { $DANGER } from '../../shared/types/danger.type';
import { Model, ModelCtor } from '../../shared/domains/model';
import { A_SERVER_MESSAGE_TYPE, ServerModelChangedMessageType } from '../../shared/smo/modules/server-message-type';
import { ClassType } from 'class-transformer/ClassTransformer';

/**
 * @description
 * Shave the oldest (assumed to be earliest in the array) off the pile
 *
 * @param max
 */
function shave(max: number) {
  return function doShaveOff<T>(opts: {
    byId: Record<string, T>,
    ids: string[]
  }): { byId: Record<string, T>, ids: string[] } {
    if (opts.ids.length <= max) return opts;

    // get ids to keep
    const from = opts.ids.length - max;
    const to = opts.ids.length;
    const ids = opts.ids.slice(from, to);
    // get bodies for those ids
    const byId: Record<string, T> = {};
    ids.forEach(id => byId[id] = opts.byId[id]);
    return { ids, byId };
  }
}

interface DataCtxValueModel<T extends Model> {
  byId: Record<string, T>;
  ids: string[],
}

interface DataCtxValue {
  chats: DataCtxValueModel<ChatModel>;
  users: DataCtxValueModel<UserModel>;
  sessions: DataCtxValueModel<SessionModel>;
}

const initialDataCtx: DataCtxValue = {
  chats: { byId: {}, ids: [], },
  users: { byId: {}, ids: [], },
  sessions: { byId: {}, ids: [], },
};

export const DataCtx = createContext<DataCtxValue>(initialDataCtx);


const _log = new Logger('DataStateCtx');

const MAX: {[K in keyof DataCtxValue]: number} = {
  chats: 10,
  sessions: Number.POSITIVE_INFINITY,
  users: Number.POSITIVE_INFINITY,
};

const trackedModels: {
  model: ModelCtor,
  key: keyof DataCtxValue,
  max: number,
  created?: ClassType<ServerModelChangedMessageType<A_SERVER_MESSAGE_TYPE, Model>>,
  updated?: ClassType<ServerModelChangedMessageType<A_SERVER_MESSAGE_TYPE, Model>>,
  deleted?: ClassType<ServerModelChangedMessageType<A_SERVER_MESSAGE_TYPE, Model>>,
}[] = [{
  model: UserModel,
  key: 'users',
  max: MAX.users,
  created: ServerMessageUserCreated,
  updated: ServerMessageUserUpdated,
}, {
  model: ChatModel,
  key: 'chats',
  max: MAX.chats,
  created: ServerMessageChatCreated,
}, {
  model: SessionModel,
  key: 'sessions',
  max: MAX.sessions,
  created: ServerMessageSessionCreated,
  updated: ServerMessageSessionUpdated,
  deleted: ServerMessageSessionDeleted,
}];


/**
 * @description
 * Create or update a model in the context
 *
 * @param nextModels
 * @param prev
 * @param maxRecords
 */
function createOrUpdateModel<M extends Model>(
  nextModels: M[] | M,
  prev: DataCtxValueModel<M>,
  maxRecords: number,
): DataCtxValueModel<M> {
  const newById = { ...prev.byId };
  if (!Array.isArray(nextModels)) nextModels = [nextModels];
  nextModels.forEach(model => newById[model.id] = model);
  const newIds = nextModels.filter(model => !(model.id in prev.byId)).map(model => model.id);
  const result = {
    ...prev,
    ...shave(maxRecords)({
      byId: newById,
      ids: newIds.length ? prev.ids.concat(newIds) : prev.ids,
    }),
  };
  return result;
}

/**
 * @description
 * Remove a model from the context
 *
 * @param toRemove
 * @param prev
 */
function removeModels<M extends Model>(
  toRemove: M[] | M,
  prev: DataCtxValueModel<M>,
): DataCtxValueModel<M> {
  const toRemoveArr = (Array.isArray(toRemove) ? toRemove : [toRemove]).map(model => model.id);
  const newIds: string[] = [];
  const newById: Record<string, M> = {};
  prev
    .ids
    .filter(id => !toRemoveArr.includes(id))
    .forEach(id => {
      newIds.push(id);
      newById[id] = prev.byId[id];
    });
  return {
    byId: newById,
    ids: newIds,
  };
}

/**
 * @description
 * Transition the entire context
 *
 * @param nextModels
 * @param key
 * @param prev
 * @param maxRecords
 * @param remove
 */
function transitionCtxValue<M extends Model>(
  nextModels: M[] | M,
  key: $DANGER<keyof DataCtxValue>,
  prev: DataCtxValue,
  maxRecords: number,
  remove: boolean,
): DataCtxValue {
  const next = {
    ...prev,
    [key]: remove
      ? removeModels(nextModels, (prev as $DANGER<any>)[key])
      : createOrUpdateModel(nextModels, (prev as $DANGER<any>)[key], maxRecords),
  }
  return next;
}


/**
 * @description
 * provides server state to the application
 *
 * @param props
 */
export const DataCtxProvider: React.FC = function DataCtxProvider(props) {
  const wsCtx = useContext(WsContext);
  const [dataCtx, setDataCtx] = useState<DataCtxValue>(initialDataCtx);

  useEffect(() => void _log.info('dataCtx changed:', dataCtx), [dataCtx]);

  useEffect(() => {
    const subs: Subscription[] = [];

    // init (reset)
    // TODO: clean this init
    subs.push(wsCtx.message$.pipe(op.filter(ofServerMessage(InitSmo)))
      .subscribe(message => {
        console.log('ABC', message);
        const newState = {
          ...initialDataCtx,
          chats: createOrUpdateModel(message.chats, initialDataCtx.chats, MAX.chats),
          sessions: createOrUpdateModel(message.sessions, initialDataCtx.sessions, MAX.sessions),
          users: createOrUpdateModel(message.users, initialDataCtx.users, MAX.users),
        };
        setDataCtx(newState)
      }
    ));

    trackedModels.forEach(defn => {
      if (defn.created) {
        subs.push(wsCtx.message$
          .pipe(op.filter(ofServerMessage(defn.created)))
          .subscribe(message => {
            setDataCtx(prev => {
              const result = transitionCtxValue(
                message.model,
                defn.key, prev,
                defn.max,
                true,
              );
              return result;
            })
          })
        );
      }

      if (defn.updated) {
        subs.push(wsCtx.message$
          .pipe(op.filter(ofServerMessage(defn.updated)))
          .subscribe(message => {
            setDataCtx(prev => {
              const result = transitionCtxValue(
                message.model,
                defn.key, prev,
                defn.max,
                true,
              );
              return result;
            })
          })
        );
      }

      if (defn.deleted) {
        subs.push(wsCtx.message$
          .pipe(op.filter(ofServerMessage(defn.deleted)))
          .subscribe(message => {
            setDataCtx(prev => {
              const result = transitionCtxValue(
                message.model,
                defn.key, prev,
                defn.max,
                false,
              );
              return result;
            })
          })
        );
      }
    });


    return () => { subs.forEach(sub => sub.unsubscribe()); }
  }, []);

  return (
    <DataCtx.Provider value={dataCtx}>
      {props.children}
    </DataCtx.Provider>
  );
}