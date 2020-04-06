// /**
//  * @description
//  * Shave the oldest (assumed to be earliest in the array) off the pile
//  *
//  * @param max
//  */
// function shave(max: number) {
//   return function doShaveOff<T>(opts: {
//     byId: Record<string, T>,
//     ids: string[]
//   }): { byId: Record<string, T>, ids: string[] } {
//     if (opts.ids.length <= max) return opts;

import { IModel } from "../../shared/interfaces/interface.model";
import { UserModel } from "../../shared/domains/user/user.model";
import { ChatModel } from "../../shared/domains/chat/chat.model";
import { SessionModel } from "../../shared/domains/session/session.model";
import { ModelCreatedSeo } from "../../server/events/models/model-created.seo";
import { ModelUpdatedSeo } from "../../server/events/models/model-updated.seo";
import { ModelDeletedSeo } from "../../server/events/models/model-deleted.seo";
import { InitSmo } from "../../shared/smo/init.smo";
import { Constructor } from "../../shared/types/constructor.type";
import { IMessage } from "../../shared/interfaces/interface.message";


// const MAX: {[K in keyof DataState['cache']]: number} = {
//   chats: 150,
//   sessions: Number.POSITIVE_INFINITY,
//   users: Number.POSITIVE_INFINITY,
// };


export interface DataState {
  cache: {
    chats: { byId: Record<string, ChatModel>, ids: string[], },
    users: { byId: Record<string, UserModel>, ids: string[], },
    sessions: { byId: Record<string, SessionModel>, ids: string[], },
  },
}

export const initialDataCtx: DataState = {
  cache: {
    chats: { byId: {}, ids: [], },
    users: { byId: {}, ids: [],  },
    sessions: { byId: {}, ids: [], },
  },
};


type DataAction = IMessage;

interface Reducer<S extends DataState, A extends DataAction>{
  (state: S, action: A): S;
}

/**
 * @description
 * Create or update user
 *
 * @param prev
 * @param action
 */
const createUpdateUserReducer: Reducer<DataState, ModelCreatedSeo<UserModel> | ModelUpdatedSeo<UserModel>> = (prev, action) => {
  const exists = action.dto.model.id in prev.cache.users;
  const result: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      users: {
        ...prev.cache.users,
        byId: { ...prev.cache.users.byId, [action.dto.model.id]: action.dto.model },
        ids: exists ? prev.cache.users.ids : prev.cache.users.ids.concat(action.dto.model.id),
      }
    }
  }
  return result;
}

/**
 * @description
 * Delete user
 *
 * @param prev
 * @param action
 */
const deleteUserReducer: Reducer<DataState, ModelDeletedSeo<UserModel>> = (prev, action) => {
  const exists = action.dto.model.id in prev.cache.users;
  if (!exists) return prev;
  const ids = prev.cache.users.ids.filter(id => id !== action.dto.model.id);
  const byId: Record<string, UserModel> = {};
  ids.forEach(id => byId[id] = prev.cache.users.byId[id]);
  const result: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      users: {
        ...prev.cache.users,
        byId: byId,
        ids: ids,
      }
    }
  }
  return result;
}

/**
 * @description
 * Create or update chat
 *
 * @param prev
 * @param action
 */
const createUpdateChatReducer: Reducer<DataState, ModelCreatedSeo<ChatModel> | ModelUpdatedSeo<ChatModel>> = (prev, action) => {
  const exists = action.dto.model.id in prev.cache.chats;
  const result: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      chats: {
        ...prev.cache.chats,
        byId: { ...prev.cache.chats.byId, [action.dto.model.id]: action.dto.model },
        ids: exists ? prev.cache.chats.ids : prev.cache.chats.ids.concat(action.dto.model.id),
      }
    }
  }
  return result;
}

/**
 * @description
 * Delete chat
 *
 * @param prev
 * @param action
 */
const deleteChatReducer: Reducer<DataState, ModelDeletedSeo<ChatModel>> = (prev, action) => {
  const exists = action.dto.model.id in prev.cache.chats;
  if (!exists) return prev;
  const ids = prev.cache.chats.ids.filter(id => id !== action.dto.model.id);
  const byId: Record<string, ChatModel> = {};
  ids.forEach(id => byId[id] = prev.cache.chats.byId[id]);
  const result: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      chats: {
        ...prev.cache.chats,
        byId: byId,
        ids: ids,
      }
    }
  }
  return result;
}

/**
 * @description
 * Create or update session
 *
 * @param prev
 * @param action
 */
const createUpdateSessionReducer: Reducer<DataState, ModelCreatedSeo<SessionModel> | ModelUpdatedSeo<SessionModel>> = (prev, action) => {
  const exists = action.dto.model.id in prev.cache.sessions;
  // const wasLoggedIn = !!prev.cache.sessions.byId[action.dto.model.id]?.user_id;
  // const isLoggedIn = !!action.dto.model.user_id;
  // const wasDeleted = prev.cache.sessions.byId[action.dto.model.id]?.deleted_at !== null ?? false;
  // const isDeleted = action.dto.model.deleted_at !== null;
  // const userDeleted = action.dto.model.user_id ? (prev.cache.users.byId[action.dto.model.id]?.deleted_at !== null ?? true) : true;

  const result: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      sessions: {
        ...prev.cache.sessions,
        byId: { ...prev.cache.sessions.byId, [action.dto.model.id]: action.dto.model },
        ids: exists ? prev.cache.sessions.ids : prev.cache.sessions.ids.concat(action.dto.model.id),
      }
    }
  }

  // if (exists) {
  //   //
  // }
  // // logged in
  // if (!isDeleted && exists && !wasLoggedIn && isLoggedIn) {
  //   const alreadyLoggedIn = prev.cache.users.loggedInIds.includes(action.dto.model.user_id!);
  //   if (!alreadyLoggedIn) result.cache.users.loggedInIds = prev.cache.users.loggedInIds.concat(action.dto.model.user_id!);
  //   result.cache.sessions.anonymousIds = prev.cache.sessions.anonymousIds.filter(ne(action.dto.model.id));
  // }

  // // logged out
  // else if (!isDeleted && exists && wasLoggedIn && !isLoggedIn) {
  //   const loggedInElsewhere = prev.cache.sessions.ids.some(id =>  {
  //     const session = prev.cache.sessions.byId[id];
  //     return (session.id !== action.dto.model.id) && !!session.user_id;
  //   });
  //   if (!loggedInElsewhere) result.cache.users.loggedInIds = prev.cache.users.loggedInIds.filter(ne(action.dto.model.user_id))
  //   result.cache.sessions.anonymousIds = prev.cache.sessions.anonymousIds.concat(action.dto.model.id);
  // }

  // else if ()

  return result;
}

/**
 * @description
 * Delete session
 *
 * @param prev
 * @param action
 */
const deleteSessionReducer: Reducer<DataState, ModelDeletedSeo<SessionModel>> = (prev, action) => {
  const exists = action.dto.model.id in prev.cache.sessions;
  if (!exists) return prev;
  const ids = prev.cache.sessions.ids.filter(id => id !== action.dto.model.id);
  const byId: Record<string, SessionModel> = {};
  ids.forEach(id => byId[id] = prev.cache.sessions.byId[id]);
  const result: DataState = {
    ...prev,
    cache: {
      ...prev.cache,
      sessions: {
        ...prev.cache.sessions,
        byId: byId,
        ids: ids,
      }
    }
  }
  return result;
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
  if (action instanceof ModelCreatedSeo || action instanceof ModelUpdatedSeo) {
    if (modelUpdatedOrCreatedSeoOf<UserModel>(UserModel)(action)) { return createUpdateUserReducer(prev, action) }
    else if (modelUpdatedOrCreatedSeoOf<ChatModel>(ChatModel)(action)) { return createUpdateChatReducer(prev, action) }
    else if (modelUpdatedOrCreatedSeoOf<SessionModel>(SessionModel)(action)) { return createUpdateSessionReducer(prev, action) }
    else if (action instanceof InitSmo) {
      const chats: DataState['cache']['chats'] = {
        ...initialDataCtx.cache.chats,
        ...(action.dto.chats.reduce((acc, next) => {
          acc.byId[next.id] = next;
          acc.ids.push(next.id);
          return acc;
        }, ({ byId: {} as Record<string, ChatModel>, ids: [] as string[] })))
      };
      const sessions: DataState['cache']['sessions'] = {
        ...initialDataCtx.cache.sessions,
        ...(action.dto.sessions.reduce((acc, next) => {
          acc.byId[next.id] = next;
          acc.ids.push(next.id);
          return acc;
        }, ({ byId: {} as Record<string, SessionModel>, ids: [] as string[] })))
      };
      const users: DataState['cache']['users'] = {
        ...initialDataCtx.cache.users,
        ...(action.dto.users.reduce((acc, next) => {
          acc.byId[next.id] = next;
          acc.ids.push(next.id);
          return acc;
        }, ({ byId: {} as Record<string, UserModel>, ids: [] as string[] })))
      };
      return {
        ...initialDataCtx,
        cache: {
          ...initialDataCtx.cache,
          users: users, 
          chats: chats, 
          sessions: sessions, 
        }
      }
    }
  }

  else if (action instanceof ModelDeletedSeo) {
    if (modelDeletedOf<UserModel>(UserModel)(action)) { return deleteUserReducer(prev, action); }
    if (modelDeletedOf<ChatModel>(ChatModel)(action)) { return deleteChatReducer(prev, action); }
    if (modelDeletedOf<SessionModel>(SessionModel)(action)) { return deleteSessionReducer(prev, action); }
  }

  return prev;
}
