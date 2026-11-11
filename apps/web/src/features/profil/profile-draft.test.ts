import { describe, expect, it } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import { createDraft, draftToPreferences, isDraftDirty, toggleValue } from './profile-draft';
import type { ProfileRegions } from './types';

const regions: ProfileRegions = {
  provinces: [{ kode: '32', nama: 'Jawa Barat' }],
  citiesByProvince: { '32': [{ kode: '3273', nama: 'Kota Bandung' }] },
};

describe('profile draft', () => {
  it('turns saved preferences into form values and back', () => {
    const saved = {
      provinsi: '32',
      kota: '3273',
      kegiatan: ['pelajar' as const],
      kegiatanLain: '',
      pendidikan: 'sma' as const,
      minat: ['Pendidikan' as const],
    };

    const draft = createDraft('Budi', saved);

    expect(draft).toMatchObject({ nama: 'Budi', provinsi: '32', kota: '3273', pendidikan: 'sma' });
    expect(draftToPreferences(draft, regions)).toEqual(saved);
  });

  it('keeps the free-text activity only while "Lainnya" is chosen', () => {
    const draft = {
      ...createDraft('', EMPTY_PREFERENCES),
      kegiatan: ['bekerja' as const],
      kegiatanLain: 'Relawan',
    };
    expect(draftToPreferences(draft, regions).kegiatanLain).toBe('');

    const other = { ...draft, kegiatan: ['lainnya' as const], kegiatanLain: '  Relawan  ' };
    expect(draftToPreferences(other, regions).kegiatanLain).toBe('Relawan');
  });

  it('drops a region or level that is not in the lists', () => {
    const draft = {
      ...createDraft('', EMPTY_PREFERENCES),
      provinsi: '99',
      kota: '9999',
      pendidikan: 'doktor',
    };

    expect(draftToPreferences(draft, regions)).toMatchObject({
      provinsi: null,
      kota: null,
      pendidikan: null,
    });
  });

  it('drops a city that belongs to another province', () => {
    const draft = { ...createDraft('', EMPTY_PREFERENCES), provinsi: '32', kota: '1171' };

    expect(draftToPreferences(draft, regions)).toMatchObject({ provinsi: '32', kota: null });
  });

  it('notices a change but ignores order and surrounding spaces', () => {
    const initial = createDraft('Budi', {
      ...EMPTY_PREFERENCES,
      minat: ['Pendidikan', 'Kesehatan'],
    });

    expect(isDraftDirty({ ...initial, minat: ['Kesehatan', 'Pendidikan'] }, initial)).toBe(false);
    expect(isDraftDirty({ ...initial, nama: ' Budi ' }, initial)).toBe(false);
    expect(isDraftDirty({ ...initial, nama: 'Budi S' }, initial)).toBe(true);
    expect(isDraftDirty({ ...initial, minat: ['Pendidikan'] }, initial)).toBe(true);
  });

  it('toggles a value in a list', () => {
    expect(toggleValue(['a', 'b'], 'b')).toEqual(['a']);
    expect(toggleValue(['a'], 'b')).toEqual(['a', 'b']);
  });
});
