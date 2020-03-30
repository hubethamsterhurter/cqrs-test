import { removeFromUniqueIndex } from "./remove-from-single-index.helper";
import { addToUniqueIndex } from "./add-to-unique-index.helper";

export function updateUniqueIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T>, models: { old: T, new: T }, indexedKey: K) {
  if (models.old[indexedKey] === models.new[indexedKey]) return;
  removeFromUniqueIndex(index, models.old, indexedKey);
  addToUniqueIndex(index, models.new, indexedKey);
}