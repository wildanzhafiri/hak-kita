import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { readProgramSourceFingerprint } from './program-source-fingerprint';
import { extractRadarSourceText } from './radar-source-text';

vi.mock('server-only', () => ({}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('program source fingerprint', () => {
  it('hashes a sourced response and preserves cache validators', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('Panduan resmi', {
          headers: { etag: '"version-1"', 'last-modified': 'Sun, 08 Nov 2026 10:00:00 GMT' },
        }),
      ),
    );

    const fingerprint = await readProgramSourceFingerprint('https://contoh.go.id/panduan');

    expect(fingerprint).toEqual({
      fingerprint: createHash('sha256').update('Panduan resmi').digest('hex'),
      etag: '"version-1"',
      lastModified: 'Sun, 08 Nov 2026 10:00:00 GMT',
      contentType: 'text/plain;charset=UTF-8',
      html: null,
    });
  });

  it('keeps the stored fingerprint when the official source returns 304', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 304 }));
    vi.stubGlobal('fetch', fetchMock);

    const fingerprint = await readProgramSourceFingerprint(
      'https://contoh.go.id/panduan',
      '"version-1"',
    );

    expect(fingerprint).toBeNull();
    expect(fetchMock.mock.calls[0]?.[1]?.headers.get('If-None-Match')).toBe('"version-1"');
  });

  it('keeps HTML evidence while hashing the entire response', async () => {
    const html = '<html><body><p>Pendaftaran dibuka pada 10 November 2026.</p></body></html>';
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } }),
        ),
    );

    expect(await readProgramSourceFingerprint('https://contoh.go.id/kabar')).toEqual({
      fingerprint: createHash('sha256')
        .update('html-v2\0')
        .update(extractRadarSourceText(html))
        .digest('hex'),
      etag: null,
      lastModified: null,
      contentType: 'text/html; charset=utf-8',
      html,
    });
  });

  it('ignores changes outside the main article and detects changed evidence', async () => {
    const responses = [
      '<html><body><script>token=first</script><main><p>Pendaftaran dibuka hari ini.</p></main></body></html>',
      '<html><body><script>token=second</script><main><p>Pendaftaran dibuka hari ini.</p></main></body></html>',
      '<html><body><script>token=third</script><main><p>Pendaftaran ditutup hari ini.</p></main></body></html>',
    ];
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(() =>
          Promise.resolve(
            new Response(responses.shift(), { headers: { 'content-type': 'text/html' } }),
          ),
        ),
    );

    const first = await readProgramSourceFingerprint('https://contoh.go.id/kabar');
    const second = await readProgramSourceFingerprint('https://contoh.go.id/kabar');
    const third = await readProgramSourceFingerprint('https://contoh.go.id/kabar');

    expect(first?.fingerprint).toBe(second?.fingerprint);
    expect(third?.fingerprint).not.toBe(first?.fingerprint);
  });

  it('does not follow a redirect outside an official domain', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 302, headers: { location: 'https://contoh.com/' } }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(readProgramSourceFingerprint('https://contoh.go.id/')).rejects.toThrow(
      'official HTTPS domain',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
