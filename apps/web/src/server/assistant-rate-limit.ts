import 'server-only';

const REQUEST_LIMIT = 12;
const WINDOW_MS = 60_000;

interface RequestWindow {
  count: number;
  expiresAt: number;
}

const requestWindows = new Map<string, RequestWindow>();

export function checkAssistantRateLimit(clientKey: string, now: number): number {
  for (const [key, window] of requestWindows) {
    if (window.expiresAt <= now) requestWindows.delete(key);
  }

  const current = requestWindows.get(clientKey);
  if (current && current.count >= REQUEST_LIMIT) {
    return Math.max(1, Math.ceil((current.expiresAt - now) / 1000));
  }

  if (current) current.count += 1;
  else requestWindows.set(clientKey, { count: 1, expiresAt: now + WINDOW_MS });

  if (requestWindows.size > 10_000) {
    const oldestKey = requestWindows.keys().next().value;
    if (oldestKey) requestWindows.delete(oldestKey);
  }

  return 0;
}
