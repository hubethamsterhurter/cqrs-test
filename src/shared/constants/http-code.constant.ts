export const HTTP_CODE = {
  _404: 404,
  _422: 422,
  _500: 500,
} as const;
export type HTTP_CODE = typeof HTTP_CODE;
export type A_HTTP_CODE = HTTP_CODE[keyof HTTP_CODE];