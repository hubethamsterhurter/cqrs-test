import { BaseModel } from "../base/base.model";
import { IModel } from "../interfaces/interface.model";

/**
 * @description
 * Mass update fields
 *
 * @param arg
 */
export function fillUpdate<M extends IModel, K extends keyof Omit<M, keyof BaseModel>>(arg: {
  mutate: M,
  keys: readonly K[],
  using: Partial<Pick<M, K>>,
}) {
  arg.keys.forEach(key => {
    const next = arg.using[key];
    if (next !== undefined) { arg.mutate[key] = next!; }
  });
}
