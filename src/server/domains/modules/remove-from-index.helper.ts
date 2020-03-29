export function removeFromIndex<T extends { id: string }, K extends keyof T>(index: Map<T[K], T[]>, stale: T, indexedKey: K) {
  index.set(
    stale[indexedKey],
    (index.get(stale[indexedKey]) || []).filter(match => match.id !== stale.id),
  )
}