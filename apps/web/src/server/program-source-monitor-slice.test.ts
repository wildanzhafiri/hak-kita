import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RadarRunEvent } from '@hakkita/schema';
import { makeProgram } from '@/test/fixtures';
import { SOURCE_CHECK_BATCH_SIZE } from './constants';

vi.mock('server-only', () => ({}));

const SOURCE_COUNT = SOURCE_CHECK_BATCH_SIZE * 2 + 1;

const mocks = vi.hoisted(() => ({
  programs: [] as unknown[],
}));

function createQuery() {
  const query = {
    select: () => query,
    eq: () => query,
    maybeSingle: async () => ({ data: null, error: null }),
    insert: async () => ({ error: null }),
    update: () => query,
    then: (resolve: (value: unknown) => unknown) => resolve({ error: null }),
  };
  return query;
}

vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ from: () => createQuery() }) }));
vi.mock('./radar-settings', () => ({
  loadRadarSettings: async () => ({ monitoring_enabled: true }),
}));
vi.mock('./data', () => ({
  loadPrograms: async () => mocks.programs,
  loadKnowledgeDocuments: async () => [],
}));
vi.mock('./program-source-fingerprint', () => ({
  readProgramSourceFingerprint: async () => ({
    fingerprint: 'sidik-jari',
    etag: null,
    lastModified: null,
    html: null,
  }),
}));
vi.mock('./radar-candidates', () => ({ queueRadarCandidate: vi.fn() }));

import { runProgramSourceMonitor } from './program-source-monitor';

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';
  mocks.programs = Array.from({ length: SOURCE_COUNT }, (_, index) =>
    makeProgram({
      id: `program-${index}`,
      sumberUtama: { url: `https://contoh${index}.go.id/`, jenis: 'situs-resmi' },
      sumberTambahan: [],
      syarat: [{ teks: 'Syarat resmi' }],
    }),
  );
});

describe('runProgramSourceMonitor in slices', () => {
  it('hands over after a batch when its time is up and continues from there', async () => {
    const events: RadarRunEvent[] = [];
    const report = (event: RadarRunEvent) => events.push(event);
    const never = new AbortController().signal;

    const first = await runProgramSourceMonitor(true, report, never, {
      startIndex: 0,
      deadline: 0,
    });

    expect(first.next).toEqual({
      index: SOURCE_CHECK_BATCH_SIZE,
      seed: null,
      carry: { checked: SOURCE_CHECK_BATCH_SIZE, changed: [], failed: [] },
    });
    expect(events.filter((event) => event.type === 'started')).toHaveLength(1);

    const second = await runProgramSourceMonitor(true, report, never, {
      startIndex: first.next?.index ?? 0,
      deadline: Date.now() + 60_000,
      carry: first.next?.carry,
    });

    expect(second.next).toBeNull();
    expect(second.checked).toBe(SOURCE_COUNT);
    expect(events.filter((event) => event.type === 'started')).toHaveLength(1);
    const lastCheck = events.filter((event) => event.type === 'source-checked').at(-1);
    expect(lastCheck).toMatchObject({ checked: SOURCE_COUNT, total: SOURCE_COUNT });
  });

  it('runs to the end in one go when no slice is given', async () => {
    const result = await runProgramSourceMonitor(true);

    expect(result.next).toBeNull();
    expect(result.checked).toBe(SOURCE_COUNT);
  });
});
