export const WS_EVENT = {
  CLOSE: 'close',
  ERROR: 'error',
  MESSAGE: 'message',
  OPEN: 'open',
  PING: 'ping',
  PONG: 'pong',
  UNEXPECTED_RESPONSE: 'unexpected-response',
  UGPRADE: 'upgrade',
} as const;
export type WS_EVENT = typeof WS_EVENT;
