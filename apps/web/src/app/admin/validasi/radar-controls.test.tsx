import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadarControls } from './radar-controls';
import { RadarRunProvider } from './radar-run-context';
import { createRadarRunState, reduceRadarRun } from './radar-run';

const refresh = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin/validasi',
  useRouter: () => ({ refresh }),
}));

const SETTINGS = {
  id: true,
  automatic_discovery_enabled: false,
  monitoring_enabled: false,
  updated_at: '2026-11-10T00:00:00Z',
} as const;

const RUNS = '/api/admin/radar/runs';
const CONTROLS = '/api/admin/radar/controls';
const RUN_ID = '4f0f6f0e-9d10-4d41-a2cb-0a8d6e4a3b11';

function streamResponse(events: object[]): Response {
  return new Response(events.map((event) => `${JSON.stringify(event)}\n`).join(''), {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}

function runsUnavailable(): Response {
  return Response.json({ error: 'Belum tersedia', code: 'runs-unavailable' }, { status: 503 });
}

function stubFetch(
  controls: (init?: RequestInit) => Response | Promise<Response>,
  runs: (init?: RequestInit) => Response | Promise<Response> = runsUnavailable,
) {
  const fetchMock = vi.fn((url: string, init?: RequestInit) =>
    Promise.resolve(url.startsWith(RUNS) ? runs(init) : controls(init)),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function callsTo(fetchMock: ReturnType<typeof stubFetch>, path: string) {
  return fetchMock.mock.calls.filter(([url]) => url === path);
}

function renderControls() {
  return render(
    <RadarRunProvider>
      <RadarControls initialSettings={SETTINGS} />
    </RadarRunProvider>,
  );
}

function runningState() {
  return createRadarRunState('discovery', Date.now());
}

function doneState() {
  return reduceRadarRun(
    reduceRadarRun(runningState(), { type: 'started', run: 'discovery', total: 1 }),
    { type: 'finished', summary: 'Pencarian selesai: 1 pencarian dan 0 kandidat baru.' },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  refresh.mockClear();
});

describe('RadarControls with the stream fallback', () => {
  it('runs program discovery manually and shows what the agent did', async () => {
    const fetchMock = stubFetch(() =>
      streamResponse([
        { type: 'started', run: 'discovery', total: 4 },
        { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
        { type: 'outcome', index: 0, result: 'queued', name: 'Jaminan Aceh', reason: null },
        { type: 'finished', summary: 'Pencarian selesai: 4 pencarian dan 2 kandidat baru.' },
      ]),
    );

    renderControls();
    fireEvent.click(screen.getByRole('button', { name: 'Cari program sekarang' }));

    await waitFor(() => expect(callsTo(fetchMock, CONTROLS)).toHaveLength(1));
    expect(JSON.parse(String(callsTo(fetchMock, CONTROLS)[0]?.[1]?.body))).toEqual({
      action: 'run_discovery',
    });
    expect(
      await screen.findByText('Pencarian selesai: 4 pencarian dan 2 kandidat baru.'),
    ).toBeTruthy();
    expect(screen.getByText(/Kandidat baru: Jaminan Aceh\./)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Muat ulang halaman' })).toBeTruthy();
  });

  it('reports a run that is refused before it starts', async () => {
    stubFetch(() => Response.json({ error: 'Tidak diizinkan' }, { status: 403 }));

    renderControls();
    fireEvent.click(screen.getByRole('button', { name: 'Periksa sumber sekarang' }));

    expect(await screen.findByText('Tidak diizinkan')).toBeTruthy();
    expect(screen.getByText('Pemeriksaan berhenti sebelum selesai')).toBeTruthy();
  });

  it('reports a stream that ends without a result', async () => {
    stubFetch(() => streamResponse([{ type: 'started', run: 'discovery', total: 4 }]));

    renderControls();
    fireEvent.click(screen.getByRole('button', { name: 'Cari program sekarang' }));

    expect(
      await screen.findByText(/Koneksi ke agen terputus sebelum pekerjaan selesai/),
    ).toBeTruthy();
  });

  it('stops a running search and keeps the panel on where it ended', async () => {
    let requestSignal: AbortSignal | null | undefined;
    stubFetch((init) => {
      requestSignal = init?.signal;
      const encoder = new TextEncoder();
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({ type: 'started', run: 'discovery', total: 4 })}\n${JSON.stringify({ type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' })}\n`,
            ),
          );
          init?.signal?.addEventListener('abort', () =>
            controller.error(new DOMException('Aborted', 'AbortError')),
          );
        },
      });
      return new Response(body);
    });

    renderControls();
    fireEvent.click(screen.getByRole('button', { name: 'Cari program sekarang' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Hentikan' }));

    expect(await screen.findByText('Dihentikan di putaran 1 dari 4')).toBeTruthy();
    expect(requestSignal?.aborted).toBe(true);
    expect(screen.queryByRole('button', { name: 'Hentikan' })).toBeNull();
  });
});

describe('RadarControls with server-side runs', () => {
  it('starts a run on the server and follows its progress', async () => {
    let polls = 0;
    const fetchMock = stubFetch(
      () => Response.json({}),
      (init) => {
        if (init?.method === 'POST') {
          return Response.json(
            { run: { id: RUN_ID, state: runningState(), finishedAt: null } },
            { status: 202 },
          );
        }
        polls += 1;
        if (polls === 1) return Response.json({ run: null });
        return Response.json({
          run: { id: RUN_ID, state: doneState(), finishedAt: new Date().toISOString() },
        });
      },
    );

    renderControls();
    fireEvent.click(await screen.findByRole('button', { name: 'Cari program sekarang' }));

    expect(await screen.findByText('Agen AI sedang mencari program baru')).toBeTruthy();
    expect(callsTo(fetchMock, CONTROLS)).toHaveLength(0);
    expect(
      await screen.findByText('Pencarian selesai: 1 pencarian dan 0 kandidat baru.', undefined, {
        timeout: 5000,
      }),
    ).toBeTruthy();
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  });

  it('does not reload the list while nothing has finished', async () => {
    stubFetch(
      () => Response.json({}),
      () => Response.json({ run: { id: RUN_ID, state: runningState(), finishedAt: null } }),
    );

    renderControls();
    await screen.findByText('Agen AI sedang mencari program baru');

    expect(refresh).not.toHaveBeenCalled();
  });

  it('closes a finished run for good and tells the server', async () => {
    const fetchMock = stubFetch(
      () => Response.json({}),
      () =>
        Response.json({
          run: { id: RUN_ID, state: doneState(), finishedAt: new Date().toISOString() },
        }),
    );

    renderControls();
    fireEvent.click(await screen.findByRole('button', { name: 'Tutup ringkasan' }));

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([url, init]) =>
            url === `${RUNS}/${RUN_ID}` && JSON.parse(String(init?.body)).action === 'dismiss',
        ),
      ).toBe(true),
    );
    expect(screen.queryByText('Pencarian selesai: 1 pencarian dan 0 kandidat baru.')).toBeNull();
  });

  it('picks up a run that is already going when the page opens', async () => {
    stubFetch(
      () => Response.json({}),
      () => Response.json({ run: { id: RUN_ID, state: runningState(), finishedAt: null } }),
    );

    renderControls();

    expect(await screen.findByText('Agen AI sedang mencari program baru')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Hentikan' })).toBeTruthy();
  });

  it('asks the server to stop the run', async () => {
    const fetchMock = stubFetch(
      () => Response.json({}),
      () => Response.json({ run: { id: RUN_ID, state: runningState(), finishedAt: null } }),
    );

    renderControls();
    fireEvent.click(await screen.findByRole('button', { name: 'Hentikan' }));

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([url, init]) =>
            url === `${RUNS}/${RUN_ID}` && JSON.parse(String(init?.body)).action === 'stop',
        ),
      ).toBe(true),
    );
    expect(await screen.findByText(/Dihentikan/)).toBeTruthy();
  });
});

describe('RadarControls settings', () => {
  it('saves a monitoring switch change', async () => {
    const fetchMock = stubFetch(() =>
      Response.json({ settings: { ...SETTINGS, monitoring_enabled: true } }),
    );

    renderControls();
    fireEvent.click(screen.getByRole('switch', { name: /Pemantauan program/ }));

    await waitFor(() => expect(callsTo(fetchMock, CONTROLS)).toHaveLength(1));
    expect(JSON.parse(String(callsTo(fetchMock, CONTROLS)[0]?.[1]?.body))).toEqual({
      action: 'monitoring',
      enabled: true,
    });
    expect(await screen.findByText('Pengaturan Radar disimpan.')).toBeTruthy();
  });
});
