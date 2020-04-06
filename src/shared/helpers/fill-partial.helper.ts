/**
 * @description
 * Mass update fields
 *
 * @param arg
 */
export function fillPartial<K extends keyof any, M extends Record<K | string, any>>(arg: {
  keys: readonly K[],
  data: Partial<Pick<M, K>>,
}): Partial<Pick<M, K>> {
  const result = {} as Pick<M, K>;
  arg.keys.forEach(key => {
    const next = arg.data[key];
    if (next !== undefined) { result[key] = next!; }
  });
  return result;
}