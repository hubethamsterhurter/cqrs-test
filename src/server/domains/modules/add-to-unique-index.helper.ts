export function addToUniqueIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T>, fresh: T, indexedKey: K) {
  index.set(fresh[indexedKey], fresh);
}