import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadarRunProvider, useRadarRunContext } from './radar-run-context';

const navigation = vi.hoisted(() => ({ pathname: '/admin/validasi' }));

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }));

function Starter() {
  const { start } = useRadarRunContext();
  return (
    <button onClick={() => void start('discovery')} type="button">
      Mulai
    </button>
  );
}

function Elsewhere() {
  return <p>Halaman lain</p>;
}

function stubFetch() {
  const fetchMock = vi.fn((...[url]: [string, RequestInit?]) =>
    Promise.resolve(
      url.startsWith('/api/admin/radar/runs')
        ? Response.json({ error: 'x', code: 'runs-unavailable' }, { status: 503 })
        : pendingStream(),
    ),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function pendingStream() {
  return new Response(new ReadableStream({ start() {} }), {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
}

describe('RadarRunProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    navigation.pathname = '/admin/validasi';
  });

  it('keeps the run alive when the admin moves to another page', async () => {
    const fetchMock = stubFetch();
    const view = render(
      <RadarRunProvider>
        <Starter />
      </RadarRunProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Mulai' }));
    });
    const controlsCall = fetchMock.mock.calls.find(([url]) => url === '/api/admin/radar/controls');
    const signal = (controlsCall?.[1] as RequestInit).signal as AbortSignal;

    navigation.pathname = '/admin/informasi';
    view.rerender(
      <RadarRunProvider>
        <Elsewhere />
      </RadarRunProvider>,
    );

    expect(screen.getByText('Halaman lain')).toBeTruthy();
    expect(signal.aborted).toBe(false);
    expect(screen.getByRole('status').textContent).toContain('Agen AI sedang mencari program baru');
    expect(screen.getByRole('link', { name: 'Lihat' }).getAttribute('href')).toBe(
      '/admin/validasi',
    );
  });

  it('does not show the floating status on the validation page itself', async () => {
    stubFetch();
    render(
      <RadarRunProvider>
        <Starter />
      </RadarRunProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Mulai' }));
    });

    expect(screen.queryByRole('link', { name: 'Lihat' })).toBeNull();
  });
});
