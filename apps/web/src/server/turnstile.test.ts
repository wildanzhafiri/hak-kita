import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from './turnstile';

vi.mock('server-only', () => ({}));

describe('verifyTurnstileToken', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('accepts a token verified for the requested host and action', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, hostname: 'localhost', action: 'assistant_chat' }),
      }),
    );

    await expect(
      verifyTurnstileToken({
        token: 'token',
        secret: 'secret',
        hostname: 'localhost',
        action: 'assistant_chat',
      }),
    ).resolves.toBe('valid');
  });

  it('rejects a token issued for a different host or action', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, hostname: 'example.com', action: 'other_action' }),
      }),
    );

    await expect(
      verifyTurnstileToken({
        token: 'token',
        secret: 'secret',
        hostname: 'localhost',
        action: 'assistant_chat',
      }),
    ).resolves.toBe('invalid');
  });

  it('reports verification service failures as unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network failure')));

    await expect(
      verifyTurnstileToken({
        token: 'token',
        secret: 'secret',
        hostname: 'localhost',
        action: 'assistant_chat',
      }),
    ).resolves.toBe('unavailable');
  });
});
