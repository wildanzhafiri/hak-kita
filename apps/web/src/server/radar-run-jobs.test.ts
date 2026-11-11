import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

type Row = Record<string, unknown> & { id: string };

const store = vi.hoisted(() => ({ rows: [] as Row[] }));
const mocks = vi.hoisted(() => ({
  discovery: vi.fn(),
  monitor: vi.fn(),
}));

function createBuilder() {
  let op: 'select' | 'insert' | 'update' = 'select';
  let payload: Record<string, unknown> = {};
  let single = false;
  let limitCount: number | undefined;
  let newestFirst = false;
  const filters: Array<(row: Row) => boolean> = [];

  const builder = {
    select: () => builder,
    insert: (value: Record<string, unknown>) => {
      op = 'insert';
      payload = value;
      return builder;
    },
    update: (value: Record<string, unknown>) => {
      op = 'update';
      payload = value;
      return builder;
    },
    eq: (key: string, value: unknown) => {
      filters.push((row) => row[key] === value);
      return builder;
    },
    neq: (key: string, value: unknown) => {
      filters.push((row) => row[key] !== value);
      return builder;
    },
    is: (key: string, value: null) => {
      filters.push((row) => (row[key] ?? null) === value);
      return builder;
    },
    lt: (key: string, value: string) => {
      filters.push((row) => row[key] != null && String(row[key]) < value);
      return builder;
    },
    gte: (key: string, value: string) => {
      filters.push((row) => String(row[key]) >= value);
      return builder;
    },
    order: () => {
      newestFirst = true;
      return builder;
    },
    limit: (count: number) => {
      limitCount = count;
      return builder;
    },
    single: () => {
      single = true;
      return builder;
    },
    maybeSingle: () => {
      single = true;
      return builder;
    },
    then: (resolve: (result: unknown) => unknown) => {
      if (op === 'insert') {
        const now = new Date().toISOString();
        const row: Row = {
          id: `run-${store.rows.length + 1}`,
          status: 'running',
          stop_requested: false,
          dismissed: false,
          cursor: null,
          lease_until: null,
          started_at: now,
          updated_at: now,
          finished_at: null,
          ...payload,
        };
        store.rows.push(row);
        return resolve({ data: single ? row : [row], error: null });
      }
      let matched = store.rows.filter((row) => filters.every((filter) => filter(row)));
      if (op === 'update') matched.forEach((row) => Object.assign(row, payload));
      if (newestFirst) {
        matched = [...matched].sort((a, b) =>
          String(b.started_at).localeCompare(String(a.started_at)),
        );
      }
      if (limitCount) matched = matched.slice(0, limitCount);
      return resolve({ data: single ? (matched[0] ?? null) : matched, error: null });
    },
  };
  return builder;
}

vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ from: () => createBuilder() }) }));
vi.mock('./radar-program-discovery', () => ({ runProgramDiscovery: mocks.discovery }));
vi.mock('./program-source-monitor', () => ({ runProgramSourceMonitor: mocks.monitor }));

import {
  RADAR_RUN_ERRORS,
  dismissRadarRun,
  loadLatestRadarRun,
  requestRadarRunStop,
  runRadarSlice,
  startRadarRun,
} from './radar-run-jobs';

const ADMIN_ID = '8d1a0f2c-3a43-4a2e-9c0b-4a3c7d9f1e11';
const ORIGIN = 'https://hakkita.test';
const MINUTE = 60_000;

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * MINUTE).toISOString();
}

function rowById(id: string): Row & { state: { summary: string | null } } {
  return store.rows.find((row) => row.id === id) as Row & { state: { summary: string | null } };
}

beforeEach(() => {
  store.rows.length = 0;
  mocks.discovery.mockReset();
  mocks.monitor.mockReset();
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';
  process.env.CRON_SECRET = 'cron-secret';
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CRON_SECRET;
});

describe('starting a run', () => {
  it('records a running run with its initial state', async () => {
    const { id, state } = await startRadarRun('discovery', ADMIN_ID);

    expect(state.status).toBe('running');
    expect(store.rows).toHaveLength(1);
    expect(store.rows[0]).toMatchObject({ id, kind: 'discovery', started_by: ADMIN_ID });
  });

  it('refuses a second run while one is still alive', async () => {
    await startRadarRun('discovery', ADMIN_ID);

    await expect(startRadarRun('monitoring', ADMIN_ID)).rejects.toThrow(
      RADAR_RUN_ERRORS.alreadyRunning,
    );
  });

  it('closes a run that nobody has touched for a long time and allows a new one', async () => {
    store.rows.push({
      id: 'old-run',
      kind: 'discovery',
      status: 'running',
      state: {},
      updated_at: minutesAgo(20),
      started_at: minutesAgo(20),
    });

    await startRadarRun('monitoring', ADMIN_ID);

    expect(store.rows.find((row) => row.id === 'old-run')?.status).toBe('failed');
    expect(store.rows.filter((row) => row.status === 'running')).toHaveLength(1);
  });

  it('reports that background runs are unavailable without database settings', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    await expect(startRadarRun('discovery', ADMIN_ID)).rejects.toThrow(
      RADAR_RUN_ERRORS.unavailable,
    );
  });
});

describe('running a slice', () => {
  it('finishes the run when the work fits in one slice', async () => {
    mocks.discovery.mockImplementation(async (_manual, report) => {
      report({ type: 'started', run: 'discovery', total: 1 });
      return { searched: 1, queued: 1, failed: [], next: null };
    });
    const { id } = await startRadarRun('discovery', ADMIN_ID);

    await runRadarSlice(id, ORIGIN);

    const row = rowById(id);
    expect(row.status).toBe('done');
    expect(row.finished_at).toBeTruthy();
    expect(row.lease_until).toBeNull();
    expect(row.state.summary).toBe('Pencarian selesai: 1 pencarian dan 1 kandidat baru.');
  });

  it('saves where it stopped and asks for the next slice when time runs out', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ accepted: true }, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    mocks.discovery.mockResolvedValueOnce({
      searched: 3,
      queued: 1,
      failed: [],
      next: { index: 4, seed: 99, carry: { searched: 3, queued: 1, failed: [] } },
    });
    const { id } = await startRadarRun('discovery', ADMIN_ID);

    await runRadarSlice(id, ORIGIN);

    const row = rowById(id);
    expect(row.status).toBe('running');
    expect(row.cursor).toEqual({
      index: 4,
      seed: 99,
      carry: { searched: 3, queued: 1, failed: [] },
    });
    expect(row.lease_until).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(String(url)).toBe(`${ORIGIN}/api/admin/radar/runs/${id}/continue`);
    expect(init.headers).toEqual({ authorization: 'Bearer cron-secret' });
  });

  it('continues from the saved position and carries the totals forward', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({}, { status: 202 })));
    mocks.discovery.mockResolvedValueOnce({
      searched: 3,
      queued: 1,
      failed: [],
      next: { index: 4, seed: 99, carry: { searched: 3, queued: 1, failed: [] } },
    });
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    await runRadarSlice(id, ORIGIN);
    mocks.discovery.mockResolvedValueOnce({ searched: 5, queued: 2, failed: [], next: null });

    await runRadarSlice(id, ORIGIN);

    const slice = mocks.discovery.mock.calls[1]?.[3];
    expect(slice).toMatchObject({
      startIndex: 4,
      seed: 99,
      carry: { searched: 3, queued: 1, failed: [] },
    });
    expect(rowById(id).status).toBe('done');
    expect(rowById(id).state.summary).toBe('Pencarian selesai: 5 pencarian dan 2 kandidat baru.');
  });

  it('does nothing while another slice holds the run', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    rowById(id).lease_until = new Date(Date.now() + MINUTE).toISOString();

    await runRadarSlice(id, ORIGIN);

    expect(mocks.discovery).not.toHaveBeenCalled();
  });

  it('takes over a run whose slice died and its lease ran out', async () => {
    mocks.discovery.mockResolvedValue({ searched: 0, queued: 0, failed: [], next: null });
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    rowById(id).lease_until = minutesAgo(1);

    await runRadarSlice(id, ORIGIN);

    expect(mocks.discovery).toHaveBeenCalledTimes(1);
    expect(rowById(id).status).toBe('done');
  });

  it('saves a failure when the agent throws', async () => {
    mocks.monitor.mockRejectedValue(new Error('boom'));
    const { id } = await startRadarRun('monitoring', ADMIN_ID);

    await runRadarSlice(id, ORIGIN);

    expect(rowById(id).status).toBe('failed');
  });

  it('stops when the admin asked for it while the slice was running', async () => {
    mocks.discovery.mockImplementation(async (_manual, report) => {
      report({ type: 'started', run: 'discovery', total: 4 });
      await new Promise((resolve) => setTimeout(resolve, 20));
      return { searched: 1, queued: 0, failed: [], next: null };
    });
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    rowById(id).stop_requested = true;

    await runRadarSlice(id, ORIGIN);

    expect(rowById(id).status).toBe('stopped');
  });
});

describe('stopping a run', () => {
  it('ends a run right away when no slice is working on it', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);

    await requestRadarRunStop(id);

    expect(rowById(id).status).toBe('stopped');
  });

  it('only raises the flag while a slice is working on it', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    rowById(id).lease_until = new Date(Date.now() + MINUTE).toISOString();

    await requestRadarRunStop(id);

    expect(rowById(id).status).toBe('running');
    expect(rowById(id).stop_requested).toBe(true);
  });
});

describe('reading the latest run', () => {
  it('returns nothing when no run happened', async () => {
    expect(await loadLatestRadarRun()).toBeNull();
  });

  it('flags a run that nobody is working on as resumable', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    rowById(id).updated_at = minutesAgo(2);

    const latest = await loadLatestRadarRun();

    expect(latest?.snapshot.state.status).toBe('running');
    expect(latest?.isResumable).toBe(true);
  });

  it('leaves a freshly started or actively worked run alone', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);

    expect((await loadLatestRadarRun())?.isResumable).toBe(false);

    rowById(id).updated_at = minutesAgo(2);
    rowById(id).lease_until = new Date(Date.now() + MINUTE).toISOString();
    expect((await loadLatestRadarRun())?.isResumable).toBe(false);
  });

  it('marks a run nobody touched for a long time as failed', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    rowById(id).updated_at = minutesAgo(20);

    const latest = await loadLatestRadarRun();

    expect(latest?.snapshot.state.status).toBe('failed');
    expect(latest?.isResumable).toBe(false);
    expect(rowById(id).status).toBe('failed');
  });

  it('hides a finished run once it is dismissed', async () => {
    mocks.discovery.mockResolvedValue({ searched: 0, queued: 0, failed: [], next: null });
    const { id } = await startRadarRun('discovery', ADMIN_ID);
    await runRadarSlice(id, ORIGIN);
    expect((await loadLatestRadarRun())?.snapshot.id).toBe(id);

    await dismissRadarRun(id);

    expect(await loadLatestRadarRun()).toBeNull();
  });

  it('does not bring an older run back after the newest one is dismissed', async () => {
    mocks.discovery.mockResolvedValue({ searched: 0, queued: 0, failed: [], next: null });
    const older = await startRadarRun('discovery', ADMIN_ID);
    await runRadarSlice(older.id, ORIGIN);
    rowById(older.id).started_at = minutesAgo(30);
    const newer = await startRadarRun('discovery', ADMIN_ID);
    await runRadarSlice(newer.id, ORIGIN);
    expect((await loadLatestRadarRun())?.snapshot.id).toBe(newer.id);

    await dismissRadarRun(newer.id);

    expect(await loadLatestRadarRun()).toBeNull();
  });

  it('does not dismiss a run that is still going', async () => {
    const { id } = await startRadarRun('discovery', ADMIN_ID);

    await dismissRadarRun(id);

    expect((await loadLatestRadarRun())?.snapshot.id).toBe(id);
  });
});
