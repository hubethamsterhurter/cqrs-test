import { SessionViewable } from "../../shared/domains/session/session.viewable";
import { ChatViewable } from "../../shared/domains/chat/chat.viewable";
import { UserViewable } from "../../shared/domains/user/user.viewable";
import { BaseViewable } from "../../shared/base/base.dto";
import { $DANGER } from "../../shared/types/danger.type";

export type ViewableState<T extends BaseViewable> =
  | { id: string, refs: number, loading: true, data: null }
  | { id: string, refs: number, loading: false, data: T }

export interface ViewableCache<T extends BaseViewable> {
  byId: Record<string, ViewableState<T>>,
  ids: string[],
}

export interface DataState {
  cache: {
    chats: ViewableCache<ChatViewable>,
    users:  ViewableCache<UserViewable>,
    sessions: ViewableCache<SessionViewable>,
  },
}

function createEntityCache<T extends BaseViewable>(): ViewableCache<T> {
  const cache: ViewableCache<T> = { byId: {}, ids: [] }
  return cache;
}

export const initialDataCtx: DataState = {
  cache: {
    chats: createEntityCache<ChatViewable>(),
    users: createEntityCache<UserViewable>(),
    sessions: createEntityCache<SessionViewable>(),
  },
};

type DataAction =
| { type: 'created', viewables: ViewableState<ChatViewable>[] | ViewableState<UserViewable>[] | ViewableState<SessionViewable>[] }
| { type: 'updated', viewables: ViewableState<ChatViewable>[] | ViewableState<UserViewable>[] | ViewableState<SessionViewable>[] }
| { type: 'deleted', viewables: string[] };

interface Reducer<S extends DataState, A extends DataAction>{
  (state: S, action: A): S;
}

/**
 * @description
 * Create or update a viewable
 *
 * @param prev
 * @param key
 * @param viewableState
 */
function upsertViewable<K extends keyof DataState['cache']> (
  prev: DataState,
  key: K,
  viewableState: ViewableState<BaseViewable> | (ViewableState<BaseViewable>[]),
): DataState {
  const viewableStates = Array.isArray(viewableState) ? viewableState : [viewableState];
  const newIds: string[] = [];
  const nextViewableCache = { ...prev.cache[key] };
  viewableStates.forEach((viewableState: ViewableState<BaseViewable>) => {
      if (!(viewableState.id in prev.cache[key].byId)) newIds.push(viewableState.id);
      nextViewableCache.byId[viewableState.id] = (viewableState as $DANGER<any>);
    })

  const next: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      [key]: {
        ...prev.cache[key],
        ids: newIds.length ? prev.cache[key].ids.concat(newIds) : prev.cache[key].ids,
        byId: nextViewableCache,
      },
    }
  }

  return next;
}



/**
 * @description
 * Delete a viewable
 *
 * @param prev
 * @param key
 * @param requestedDeletingIds
 */
function deleteViewable<K extends keyof DataState['cache']> (
  prev: DataState,
  key: K,
  requestedDeletingIds: string[],
): DataState {
  const deletingIds = requestedDeletingIds.filter(id => id in prev.cache[key].byId);
  if (deletingIds.length === 0) return prev;
  const nextIds = prev.cache[key].ids.filter(id => !deletingIds.includes(id));
  const nextViewableCache = nextIds.map(id => prev.cache[key].byId[id]);

  const next: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      [key]: {
        ...prev.cache[key],
        ids: nextIds,
        byId: nextViewableCache,
      },
    }
  }

  return next;
}



function modelUpdatedOrCreatedSeoOf<M extends IModel>(Ctor: Constructor<IModel>) {
  return function doFilter(action: ModelCreatedSeo | ModelUpdatedSeo): action is (ModelCreatedSeo<M> | ModelUpdatedSeo<M>)  {
    return action.dto.model instanceof Ctor;
  }
}


function modelDeletedOf<M extends IModel>(Ctor: Constructor<IModel>) {
  return function doFilter(action: ModelDeletedSeo): action is ModelDeletedSeo<M> {
    return action.dto.model instanceof Ctor;
  }
}


export const dataReducer: Reducer<DataState, DataAction> = function dataReducer(prev: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'created':
    case 'updated':
      return upsertViewable(prev, action.viewables)
      
      break;
  
    default:
      break;
  }
  // if (action instanceof ModelCreatedSeo || action instanceof ModelUpdatedSeo) {
  //   if (modelUpdatedOrCreatedSeoOf<UserModel>(UserModel)(action)) { return createUpdateUserReducer(prev, action) }
  //   else if (modelUpdatedOrCreatedSeoOf<ChatModel>(ChatModel)(action)) { return createUpdateChatReducer(prev, action) }
  //   else if (modelUpdatedOrCreatedSeoOf<SessionModel>(SessionModel)(action)) { return createUpdateSessionReducer(prev, action) }
  //   else if (action instanceof InitSmo) {
  //     const chats: DataState['cache']['chats'] = {
  //       ...initialDataCtx.cache.chats,
  //       ...(action.dto.chats.reduce((acc, next) => {
  //         acc.byId[next.id] = next;
  //         acc.ids.push(next.id);
  //         return acc;
  //       }, ({ byId: {} as Record<string, ChatModel>, ids: [] as string[] })))
  //     };
  //     const sessions: DataState['cache']['sessions'] = {
  //       ...initialDataCtx.cache.sessions,
  //       ...(action.dto.sessions.reduce((acc, next) => {
  //         acc.byId[next.id] = next;
  //         acc.ids.push(next.id);
  //         return acc;
  //       }, ({ byId: {} as Record<string, SessionModel>, ids: [] as string[] })))
  //     };
  //     const users: DataState['cache']['users'] = {
  //       ...initialDataCtx.cache.users,
  //       ...(action.dto.users.reduce((acc, next) => {
  //         acc.byId[next.id] = next;
  //         acc.ids.push(next.id);
  //         return acc;
  //       }, ({ byId: {} as Record<string, UserModel>, ids: [] as string[] })))
  //     };
  //     return {
  //       ...initialDataCtx,
  //       cache: {
  //         ...initialDataCtx.cache,
  //         users: users, 
  //         chats: chats, 
  //         sessions: sessions, 
  //       }
  //     }
  //   }
  // }

  // else if (action instanceof ModelDeletedSeo) {
  //   if (modelDeletedOf<UserModel>(UserModel)(action)) { return deleteUserReducer(prev, action); }
  //   if (modelDeletedOf<ChatModel>(ChatModel)(action)) { return deleteChatReducer(prev, action); }
  //   if (modelDeletedOf<SessionModel>(SessionModel)(action)) { return deleteSessionReducer(prev, action); }
  // }

  return prev;
}
