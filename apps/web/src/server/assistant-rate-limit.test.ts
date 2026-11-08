import { describe, expect, it, vi } from 'vitest';
import { checkAssistantRateLimit } from './assistant-rate-limit';

vi.mock('server-only', () => ({}));

describe('checkAssistantRateLimit', () => {
  it('limits a client after twelve requests in one minute', () => {
    const clientKey = `assistant-${Math.random()}`;
    for (let index = 0; index < 12; index += 1) {
      expect(checkAssistantRateLimit(clientKey, 100_000)).toBe(0);
    }

    expect(checkAssistantRateLimit(clientKey, 100_000)).toBe(60);
  });

  it('allows requests after the window expires', () => {
    const clientKey = `assistant-${Math.random()}`;
    for (let index = 0; index < 12; index += 1) {
      checkAssistantRateLimit(clientKey, 100_000);
    }

    expect(checkAssistantRateLimit(clientKey, 160_000)).toBe(0);
  });
});
