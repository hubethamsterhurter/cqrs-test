export function removeFromUniqueIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T>, stale: T, indexedKey: K) {
  index.delete(stale[indexedKey]);
}