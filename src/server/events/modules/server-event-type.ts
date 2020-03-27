export const SERVER_EVENT_TYPE = {
  HEARTBEAT: 'heartbeat',

  // Socket Server
  SOCKET_SERVER_CONNECTION: 'socket_server_connection',
  SOCKET_SERVER_CLOSE: 'socket_server_close',
  SOCKET_SERVER_ERROR: 'socket_server_error',
  SOCKET_SERVER_HEADERS: 'socket_server_errors',
  SOCKET_SERVER_LISTENING: 'socket_server_listening',

  // Socket Client
  SOCKET_CLIENT_CLOSE: 'socket_client_close',
  SOCKET_CLIENT_ERROR: 'socket_client_error',
  SOCKET_CLIENT_MESSAGE: 'socket_client_message',
  SOCKET_CLIENT_MESSAGE_PARSED: 'socket_client_message_parsed',
  SOCKET_CLIENT_MESSAGE_INVALID: 'socket_client_message_invalid',
  SOCKET_CLIENT_MESSAGE_MALFORMED: 'socket_client_message_malformed',
  SOCKET_CLIENT_OPEN: 'socket_client_open',
  SOCKET_CLIENT_PING: 'socket_client_ping',
  SOCKET_CLIENT_PONG: 'socket_client_pong',
  SOCKET_CLIENT_UGPRADE: 'socket_client_ugprade',
  SOCKET_CLIENT_UNEXPECTED_RESPONSE: 'socket_client_unexpected_response',

  // model
  MODEL_CREATED: 'model_created',
  MODEL_UPDATED: 'model_updated',
  MODEL_DELETED: 'model_deleted',

  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
} as const;
export type SERVER_EVET_TYPE = typeof SERVER_EVENT_TYPE;
export type A_SERVER_EVENT_TYPE = SERVER_EVET_TYPE[keyof SERVER_EVET_TYPE];