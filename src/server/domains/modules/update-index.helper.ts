import { removeFromIndex } from "./remove-from-index.helper";
import { addToIndex } from "./add-to-index.helper";

export function updateIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T[]>, models: { old: T, new: T }, indexedKey: K) {
  if (models.old[indexedKey] === models.new[indexedKey]) return;
  removeFromIndex(index, models.old, indexedKey);
  addToIndex(index, models.new, indexedKey);
}