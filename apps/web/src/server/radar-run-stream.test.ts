import { describe, expect, it, vi } from 'vitest';
import { streamRadarRun } from './radar-run-stream';

vi.mock('server-only', () => ({}));

async function readLines(response: Response): Promise<unknown[]> {
  const text = await response.text();
  return text
    .split('\n')
    .filter((line) => line !== '')
    .map((line): unknown => JSON.parse(line));
}

describe('streamRadarRun', () => {
  it('streams reported events and ends with the summary', async () => {
    const response = streamRadarRun(async (report) => {
      report({ type: 'started', run: 'discovery', total: 4 });
      report({ type: 'drafting', index: 0 });
      return 'Pencarian selesai: 4 pencarian dan 0 kandidat baru.';
    });

    expect(response.headers.get('Content-Type')).toContain('application/x-ndjson');
    expect(await readLines(response)).toEqual([
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'drafting', index: 0 },
      { type: 'finished', summary: 'Pencarian selesai: 4 pencarian dan 0 kandidat baru.' },
    ]);
  });

  it('reports a generic failure without leaking the error message', async () => {
    const response = streamRadarRun(async (report) => {
      report({ type: 'started', run: 'monitoring', total: 2 });
      throw new Error('kunci rahasia salah');
    });

    const lines = await readLines(response);

    expect(lines.at(-1)).toEqual({
      type: 'failed',
      message: 'Radar gagal dijalankan. Periksa konfigurasi dan coba lagi.',
    });
    expect(JSON.stringify(lines)).not.toContain('rahasia');
  });

  it('aborts the run when the client goes away', async () => {
    let runSignal: AbortSignal | undefined;
    const response = streamRadarRun(async (report, signal) => {
      runSignal = signal;
      report({ type: 'started', run: 'discovery', total: 4 });
      await new Promise((resolve) => signal.addEventListener('abort', resolve));
      return 'tidak dikirim';
    });
    const reader = response.body?.getReader();
    if (!reader) throw new Error('stream has no body');

    await reader.read();
    await reader.cancel();

    expect(runSignal?.aborted).toBe(true);
  });

  it('aborts the run when the request itself is aborted', async () => {
    const requestAbort = new AbortController();
    let runSignal: AbortSignal | undefined;
    streamRadarRun(async (_report, signal) => {
      runSignal = signal;
      await new Promise((resolve) => signal.addEventListener('abort', resolve));
      return 'x';
    }, requestAbort.signal);

    await new Promise((resolve) => setTimeout(resolve, 0));
    requestAbort.abort();

    expect(runSignal?.aborted).toBe(true);
  });
});
