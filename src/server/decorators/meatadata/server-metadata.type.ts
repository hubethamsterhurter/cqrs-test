import { ClientMessageHandlerMetadata } from "./client-message-handler.metadata";
import { ServerEventHandlerMetadata } from "./server-event-handler.metadata";
import { ServerModelCreatedEventHandlerMetadata } from "./server-model-created-event-handler.metadata";
import { ServerModelUpdatedEventHandlerMetadata } from "./server-model-updated-event-handler.metadata";
import { ServerModelDeletedEventHandlerMetadata } from "./server-model-deleted-event-handler.metadata";

export type ServerMetadataCtor =
  | typeof ClientMessageHandlerMetadata
  | typeof ServerEventHandlerMetadata
  | typeof ServerModelCreatedEventHandlerMetadata
  | typeof ServerModelUpdatedEventHandlerMetadata
  | typeof ServerModelDeletedEventHandlerMetadata

export type ServerMetadata = ServerMetadataCtor['prototype']