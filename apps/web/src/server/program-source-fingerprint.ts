import 'server-only';
import { createHash } from 'node:crypto';
import { isOfficialDomain } from '@hakkita/domain';
import {
  SOURCE_CHECK_MAX_BYTES,
  SOURCE_CHECK_MAX_REDIRECTS,
  SOURCE_CHECK_TIMEOUT_MS,
} from './constants';
import type { ProgramSourceFingerprint } from './types';

export async function readProgramSourceFingerprint(
  sourceUrl: string,
  etag: string | null = null,
  lastModified: string | null = null,
): Promise<ProgramSourceFingerprint | null> {
  let currentUrl = sourceUrl;
  const headers = new Headers();
  if (etag) headers.set('If-None-Match', etag);
  if (lastModified) headers.set('If-Modified-Since', lastModified);

  for (let redirectCount = 0; redirectCount <= SOURCE_CHECK_MAX_REDIRECTS; redirectCount++) {
    if (!currentUrl.startsWith('https://') || !isOfficialDomain(currentUrl)) {
      throw new Error('Source URL is not an official HTTPS domain');
    }

    const response = await fetch(currentUrl, {
      headers,
      redirect: 'manual',
      signal: AbortSignal.timeout(SOURCE_CHECK_TIMEOUT_MS),
    });
    if (response.status === 304) return null;

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Source redirect has no location');
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
    if (!response.body) throw new Error('Source response has no body');

    const sizeHeader = Number(response.headers.get('content-length'));
    if (sizeHeader > SOURCE_CHECK_MAX_BYTES) throw new Error('Source response is too large');

    const hash = createHash('sha256');
    const reader = response.body.getReader();
    let bytesRead = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytesRead += value.byteLength;
        if (bytesRead > SOURCE_CHECK_MAX_BYTES) throw new Error('Source response is too large');
        hash.update(value);
      }
    } finally {
      reader.releaseLock();
      await response.body.cancel().catch(() => undefined);
    }

    return {
      fingerprint: hash.digest('hex'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    };
  }

  throw new Error('Source redirected too many times');
}
