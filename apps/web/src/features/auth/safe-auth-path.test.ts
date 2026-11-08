import { describe, expect, it } from 'vitest';
import { DEFAULT_AUTH_REDIRECT } from './constants';
import { safeAuthPath } from './safe-auth-path';

describe('safeAuthPath', () => {
  it('keeps a local path', () => {
    expect(safeAuthPath('/rencanaku?tab=tersimpan')).toBe('/rencanaku?tab=tersimpan');
  });

  it('falls back for an external or malformed path', () => {
    expect(safeAuthPath('https://example.com')).toBe(DEFAULT_AUTH_REDIRECT);
    expect(safeAuthPath('//example.com')).toBe(DEFAULT_AUTH_REDIRECT);
    expect(safeAuthPath('/\\example.com')).toBe(DEFAULT_AUTH_REDIRECT);
  });
});
