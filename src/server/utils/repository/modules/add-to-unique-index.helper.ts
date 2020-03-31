export function addToUniqueIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T>, fresh: T, indexedKey: K) {
  if (index.has(fresh[indexedKey])) {
    throw new Error(`Unique index constraint violation - ${fresh.constructor.name} with ${indexedKey} value ${fresh[indexedKey]} already exists.`);
  }
  index.set(fresh[indexedKey], fresh);
}