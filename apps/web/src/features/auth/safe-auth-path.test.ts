import { describe, expect, it } from 'vitest';
import { DEFAULT_AUTH_REDIRECT } from './constants';
import { guestDestination, safeAuthPath } from './safe-auth-path';

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

describe('guestDestination', () => {
  it('lets a guest carry on to a public page they came from', () => {
    expect(guestDestination('/kenali-hakmu/kip-kuliah')).toBe('/kenali-hakmu/kip-kuliah');
    expect(guestDestination('/layanan')).toBe('/layanan');
  });

  it('sends a guest to the catalog instead of a page that needs an account', () => {
    for (const path of [
      '/rencanaku',
      '/rencanaku/berkas',
      '/profil/edit',
      '/selamat-datang',
      '/kenali-hakmu/rekomendasi',
    ]) {
      expect(guestDestination(path)).toBe('/kenali-hakmu');
    }
  });

  it('falls back to the catalog for a missing, external or malformed path', () => {
    expect(guestDestination(undefined)).toBe('/kenali-hakmu');
    expect(guestDestination('https://example.com')).toBe('/kenali-hakmu');
    expect(guestDestination('//example.com')).toBe('/kenali-hakmu');
  });
});
