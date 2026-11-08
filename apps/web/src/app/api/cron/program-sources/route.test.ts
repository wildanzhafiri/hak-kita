import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/server/program-source-monitor', () => ({
  runProgramSourceMonitor: vi.fn(),
}));

import { runProgramSourceMonitor } from '@/server/program-source-monitor';
import { GET } from './route';

const monitor = vi.mocked(runProgramSourceMonitor);

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('program source cron', () => {
  it('rejects requests without the cron secret', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');
    const request = new NextRequest('http://localhost/api/cron/program-sources');

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(monitor).not.toHaveBeenCalled();
  });

  it('reports changed source URLs only to an authorized request', async () => {
    vi.stubEnv('CRON_SECRET', 'secret');
    monitor.mockResolvedValue({ checked: 2, changed: ['https://contoh.go.id/'], failed: [] });
    const request = new NextRequest('http://localhost/api/cron/program-sources', {
      headers: { authorization: 'Bearer secret' },
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      checked: 2,
      changed: ['https://contoh.go.id/'],
      failed: [],
    });
  });
});
