import { BaseModel } from "../base/base.model";
import { IModel } from "../interfaces/interface.model";

/**
 * @description
 * Mass update fields
 *
 * @param model
 * @param keys
 * @param modifiers
 */
export function fill<M extends IModel, K extends keyof Omit<M, keyof BaseModel>>(
  model: M,
  keys: K[],
  modifiers: Partial<Pick<M, K>>,
): M {
  keys.forEach(key => {
    const next = modifiers[key];
    if (next !== undefined) { model[key] = next!; }
  });
  return model;
}