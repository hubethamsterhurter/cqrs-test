/**
 * @description
 * Convert a union type to a key-value type
 */
export type UToKV<T extends Record<PropertyKey, any>, U extends keyof T> = {[K in T[U]]: Extract<T, { [P in U]: K }>};