import { describe, expect, it } from 'vitest';
import { checkSumberUtama, hostnameOf, isOfficialDomain, isStale } from './source';

describe('hostnameOf', () => {
  it('returns the lowercase hostname', () => {
    expect(hostnameOf('https://Kemensos.GO.ID/path')).toBe('kemensos.go.id');
  });

  it('returns null for text that is not a URL', () => {
    expect(hostnameOf('bukan-url')).toBeNull();
  });
});

describe('isOfficialDomain', () => {
  it('accepts go.id and its subdomains', () => {
    expect(isOfficialDomain('https://kemensos.go.id/')).toBe(true);
    expect(isOfficialDomain('https://cekbansos.kemensos.go.id/profil')).toBe(true);
  });

  it('rejects unofficial and lookalike domains', () => {
    expect(isOfficialDomain('https://beritabansos.com/')).toBe(false);
    expect(isOfficialDomain('https://kemensos.go.id.palsu.com/')).toBe(false);
    expect(isOfficialDomain('https://notgo.id/')).toBe(false);
    expect(isOfficialDomain('bukan-url')).toBe(false);
  });
});

describe('checkSumberUtama', () => {
  it('accepts an official site on go.id', () => {
    expect(checkSumberUtama({ url: 'https://prakerja.go.id/', jenis: 'situs-resmi' })).toBeNull();
  });

  it('rejects an unofficial domain for an official source type', () => {
    expect(checkSumberUtama({ url: 'https://blog.example.com/', jenis: 'situs-resmi' })).toMatch(
      /\.go\.id/,
    );
  });

  it('rejects plain http', () => {
    expect(checkSumberUtama({ url: 'http://prakerja.go.id/', jenis: 'situs-resmi' })).toMatch(
      /https/,
    );
  });

  it('allows a distributing bank as the documented exception', () => {
    expect(checkSumberUtama({ url: 'https://bri.co.id/kur', jenis: 'bank-penyalur' })).toBeNull();
  });
});

describe('isStale', () => {
  it('flags data older than 90 days', () => {
    expect(isStale('2026-07-01', '2026-10-30')).toBe(true);
    expect(isStale('2026-09-01', '2026-10-30')).toBe(false);
  });

  it('does not flag data exactly at the limit', () => {
    expect(isStale('2026-08-01', '2026-10-30')).toBe(false);
    expect(isStale('2026-07-31', '2026-10-30')).toBe(true);
  });

  it('accepts a custom limit', () => {
    expect(isStale('2026-10-20', '2026-10-30', 5)).toBe(true);
  });
});
