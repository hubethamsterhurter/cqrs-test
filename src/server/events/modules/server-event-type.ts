export const SERVER_EVENT_TYPE = {
  HEARTBEAT: 'heartbeat',

  // Socket Server
  SOCKET_SERVER_CONNECTION: 'ss_connection',
  SOCKET_SERVER_CLOSE: 'ss_close',
  SOCKET_SERVER_ERROR: 'ss_error',
  SOCKET_SERVER_HEADERS: 'ss_errors',
  SOCKET_SERVER_LISTENING: 'ss_listening',

  // Socket Client
  SOCKET_CLIENT_CLOSE: 'sc_close',
  SOCKET_CLIENT_ERROR: 'sc_error',
  SOCKET_CLIENT_RAW_MESSAGE: 'sc_raw_message',
  SOCKET_CLIENT_MESSAGE: 'sc_message_parsed',
  SOCKET_CLIENT_MESSAGE_INVALID: 'sc_message_invalid',
  SOCKET_CLIENT_MESSAGE_MALFORMED: 'sc_message_malformed',
  SOCKET_CLIENT_OPEN: 'sc_open',
  SOCKET_CLIENT_PING: 'sc_ping',
  SOCKET_CLIENT_PONG: 'sc_pong',
  SOCKET_CLIENT_UGPRADE: 'sc_ugprade',
  SOCKET_CLIENT_UNEXPECTED_RESPONSE: 'sc_unexpected_response',

  // model
  MODEL_CREATED: 'model_created',
  MODEL_UPDATED: 'model_updated',
  MODEL_DELETED: 'model_deleted',

  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
} as const;
export type SERVER_EVENT_TYPE = typeof SERVER_EVENT_TYPE;
export type A_SERVER_EVENT_TYPE = SERVER_EVENT_TYPE[keyof SERVER_EVENT_TYPE];