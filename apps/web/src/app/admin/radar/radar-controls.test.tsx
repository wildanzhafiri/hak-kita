import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadarControls } from './radar-controls';

const SETTINGS = {
  id: true,
  automatic_discovery_enabled: false,
  monitoring_enabled: false,
  updated_at: '2026-11-10T00:00:00Z',
} as const;

function streamResponse(events: object[]): Response {
  return new Response(events.map((event) => `${JSON.stringify(event)}\n`).join(''), {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('RadarControls', () => {
  it('runs program discovery manually and shows what the agent did', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      streamResponse([
        { type: 'started', run: 'discovery', total: 4 },
        { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
        { type: 'outcome', index: 0, result: 'queued', name: 'Jaminan Aceh', reason: null },
        { type: 'finished', summary: 'Pencarian selesai: 4 pencarian dan 2 kandidat baru.' },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<RadarControls initialSettings={SETTINGS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cari program sekarang' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body)).toEqual({ action: 'run_discovery' });
    expect(
      await screen.findByText('Pencarian selesai: 4 pencarian dan 2 kandidat baru.'),
    ).toBeTruthy();
    expect(screen.getByText(/Kandidat baru: Jaminan Aceh\./)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Muat ulang halaman' })).toBeTruthy();
  });

  it('reports a run that is refused before it starts', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ error: 'Tidak diizinkan' }, { status: 403 })),
    );

    render(<RadarControls initialSettings={SETTINGS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Periksa sumber sekarang' }));

    expect(await screen.findByText('Tidak diizinkan')).toBeTruthy();
    expect(screen.getByText('Pemeriksaan berhenti sebelum selesai')).toBeTruthy();
  });

  it('reports a stream that ends without a result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(streamResponse([{ type: 'started', run: 'discovery', total: 4 }])),
    );

    render(<RadarControls initialSettings={SETTINGS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cari program sekarang' }));

    expect(
      await screen.findByText(/Koneksi ke agen terputus sebelum pekerjaan selesai/),
    ).toBeTruthy();
  });

  it('stops a running search and keeps the panel on where it ended', async () => {
    let requestSignal: AbortSignal | null | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
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
        return Promise.resolve(new Response(body));
      }),
    );

    render(<RadarControls initialSettings={SETTINGS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cari program sekarang' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Hentikan' }));

    expect(await screen.findByText('Dihentikan di putaran 1 dari 4')).toBeTruthy();
    expect(requestSignal?.aborted).toBe(true);
    expect(screen.queryByRole('button', { name: 'Hentikan' })).toBeNull();
  });

  it('saves a monitoring switch change', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ settings: { ...SETTINGS, monitoring_enabled: true } }));
    vi.stubGlobal('fetch', fetchMock);

    render(<RadarControls initialSettings={SETTINGS} />);
    fireEvent.click(screen.getByRole('switch', { name: /Pemantauan program/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body)).toEqual({
      action: 'monitoring',
      enabled: true,
    });
    expect(await screen.findByText('Pengaturan Radar disimpan.')).toBeTruthy();
  });
});
