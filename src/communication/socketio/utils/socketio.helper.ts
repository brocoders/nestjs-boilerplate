/** Ensure namespace has a leading slash and fallback to /ws */
export function normalizeNamespace(namespace?: string): string {
  const raw = (namespace ?? '').trim();
  if (!raw) return '/ws';
  return raw.startsWith('/') ? raw : `/${raw}`;
}
