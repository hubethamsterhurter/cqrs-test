import { removeFromUniqueIndex } from "./remove-from-single-index.helper";
import { addToUniqueIndex } from "./add-to-unique-index.helper";

export function updateUniqueIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T>, models: { old: T, new: T }, indexedKey: K) {
  if (models.old[indexedKey] === models.new[indexedKey]) return;
  if (index.has(models.new[indexedKey])) {
    throw new Error(`Unique index constraint violation - ${models.new.constructor.name} with ${indexedKey} value ${models.new[indexedKey]} already exists.`);
  }
  removeFromUniqueIndex(index, models.old, indexedKey);
  addToUniqueIndex(index, models.new, indexedKey);
}