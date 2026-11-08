import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { readProgramSourceFingerprint } from './program-source-fingerprint';

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
