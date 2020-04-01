/**
 * @description
 * Mass update fields
 *
 * @param arg
 */
export function fillCreate<K extends keyof any, M extends Record<K | string, any>>(arg: {
  keys: readonly K[],
  using: Pick<M, K>,
}): Pick<M, K> {
  const result = {} as Pick<M, K>;
  arg.keys.forEach(key => {
    const next = arg.using[key];
    if (next !== undefined) { result[key] = next!; }
  });
  return result;
}