export const SERVER_METADATA_KEY = {
  SERVER_EVENT_HANDLER: 'metadata::server_event_handler',
  MODEL_CREATED_EVENT_HANDLER: 'metadata::model_created_event_handler',
  MODEL_UPDATED_EVENT_HANDLER: 'metadata::model_updated_event_handler',
  MODEL_DELETED_EVENT_HANDLER: 'metadata::model_deleted_event_handler',
  CLIENT_MESSAGE_HANDLER: 'metadata::client_message_handler',
} as const;
export type SERVER_METADATA_KEY = typeof SERVER_METADATA_KEY;
export type A_SERVER_METADATA_KEY = SERVER_METADATA_KEY[keyof SERVER_METADATA_KEY];