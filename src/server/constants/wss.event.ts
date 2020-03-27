export const WSS_EVENT = {
  CONNECTION: 'connection',
  CLOSE: 'close',
  ERROR: 'error',
  HEADERS: 'headers',
  LISTENING: 'listening',
} as const;
export type WSS_EVENT = typeof WSS_EVENT;
