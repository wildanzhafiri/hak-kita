import { afterEach, describe, expect, it, vi } from 'vitest';
import { discoverOfficialPages } from './radar-crawler';

vi.mock('server-only', () => ({}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Radar official crawler', () => {
  it('uses robots policy and follows official sitemap and article links', async () => {
    const responses = new Map([
      [
        'https://instansi.go.id/robots.txt',
        new Response('User-agent: *\nDisallow: /internal', {
          headers: { 'content-type': 'text/plain' },
        }),
      ],
      [
        'https://instansi.go.id/sitemap.xml',
        new Response(
          '<urlset><url><loc>https://instansi.go.id/program</loc></url><url><loc>https://instansi.go.id/internal</loc></url></urlset>',
          { headers: { 'content-type': 'application/xml' } },
        ),
      ],
      [
        'https://instansi.go.id/index',
        new Response('<main><a href="/berita/program-bantuan">Pengumuman program</a></main>', {
          headers: { 'content-type': 'text/html' },
        }),
      ],
      [
        'https://instansi.go.id/program',
        new Response('<main><p>Program resmi</p></main>', {
          headers: { 'content-type': 'text/html' },
        }),
      ],
      [
        'https://instansi.go.id/berita/program-bantuan',
        new Response('<main><p>Pengumuman resmi program bantuan</p></main>', {
          headers: { 'content-type': 'text/html' },
        }),
      ],
    ]);
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      return responses.get(url) ?? new Response('missing', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const pages = await discoverOfficialPages(['https://instansi.go.id/index']);

    expect(pages).toContain('https://instansi.go.id/index');
    expect(pages).toContain('https://instansi.go.id/program');
    expect(pages).toContain('https://instansi.go.id/berita/program-bantuan');
    expect(pages).not.toContain('https://instansi.go.id/internal');
    expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/internal'))).toBe(false);
  });
});
