import 'server-only';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { checkObstacleReportRateLimit } from './obstacle-report-rate-limit';

describe('checkObstacleReportRateLimit', () => {
  it('allows five reports and blocks the next one in the same window', () => {
    const clientKey = 'rate-limit-first-client';

    for (let index = 0; index < 5; index += 1) {
      expect(checkObstacleReportRateLimit(clientKey, 1_000)).toBe(0);
    }

    expect(checkObstacleReportRateLimit(clientKey, 1_000)).toBe(600);
  });

  it('allows reports again after the rate window expires', () => {
    const clientKey = 'rate-limit-expiring-client';

    for (let index = 0; index < 5; index += 1) {
      checkObstacleReportRateLimit(clientKey, 1_000);
    }

    expect(checkObstacleReportRateLimit(clientKey, 601_000)).toBe(0);
  });
});
