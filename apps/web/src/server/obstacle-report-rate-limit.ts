import 'server-only';
import { OBSTACLE_REPORT_RATE_LIMIT, OBSTACLE_REPORT_RATE_WINDOW_MS } from '@/config/obstacle-reports';

interface RateWindow {
  count: number;
  expiresAt: number;
}

const windows = new Map<string, RateWindow>();

export function checkObstacleReportRateLimit(clientKey: string, now: number): number {
  for (const [key, window] of windows) {
    if (window.expiresAt <= now) windows.delete(key);
  }

  const current = windows.get(clientKey);
  if (current && current.count >= OBSTACLE_REPORT_RATE_LIMIT) {
    return Math.max(1, Math.ceil((current.expiresAt - now) / 1000));
  }

  if (current) {
    current.count += 1;
  } else {
    windows.set(clientKey, { count: 1, expiresAt: now + OBSTACLE_REPORT_RATE_WINDOW_MS });
  }

  if (windows.size > 10_000) {
    const oldestKey = windows.keys().next().value;
    if (oldestKey) windows.delete(oldestKey);
  }

  return 0;
}
