/**
 * Simple in-memory client-side cache keyed by route / query.
 * Enables Stale-While-Revalidate so navigating back to pages
 * displays previously loaded data instantly without blank skeletons or layout shift.
 */

const memoryCache = new Map<string, { data: unknown; timestamp: number }>();

export function getCachedRouteData<T>(key: string, maxAgeMs: number = 5 * 60 * 1000): T | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > maxAgeMs) {
    memoryCache.delete(key);
    return null;
  }
  return cached.data as T;
}

export function setCachedRouteData<T>(key: string, data: T): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

export function clearRouteCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    memoryCache.clear();
    return;
  }
  for (const k of memoryCache.keys()) {
    if (k.startsWith(keyPrefix)) {
      memoryCache.delete(k);
    }
  }
}
