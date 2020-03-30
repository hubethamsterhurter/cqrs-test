import { removeFromManyIndex } from "./remove-from-many-index.helper";
import { addToManyIndex } from "./add-to-many-index.helper";

export function updateManyIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T[]>, models: { old: T, new: T }, indexedKey: K) {
  if (models.old[indexedKey] === models.new[indexedKey]) return;
  removeFromManyIndex(index, models.old, indexedKey);
  addToManyIndex(index, models.new, indexedKey);
}