import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { PreferensiProfil } from '@hakkita/schema';
import type { ProfileRegions } from '@/features/profil/types';
import {
  canAdvance,
  finderStorageKey,
  freshFinderState,
  loadFinderState,
  saveFinderState,
  summarizeAnswers,
  toggleItem,
} from './finder-state';

const SAVED: PreferensiProfil = {
  ...EMPTY_PREFERENCES,
  minat: ['Pendidikan'],
  kegiatan: ['mahasiswa'],
};

const REGIONS: ProfileRegions = {
  provinces: [{ kode: '31', nama: 'DKI Jakarta' }],
  citiesByProvince: { '31': [{ kode: '3171', nama: 'Jakarta Selatan' }] },
};

describe('finder state', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('keeps guests and signed-in people in separate storage slots', () => {
    expect(finderStorageKey(null)).not.toBe(finderStorageKey('user-1'));
    expect(finderStorageKey('user-1')).not.toBe(finderStorageKey('user-2'));
  });

  it('offers the saved profile only when the profile has something in it', () => {
    expect(loadFinderState('k', EMPTY_PREFERENCES).showProfileChoice).toBe(false);
    expect(loadFinderState('k', SAVED).showProfileChoice).toBe(true);
  });

  it('restores what was saved earlier in the same tab', () => {
    const state = {
      ...freshFinderState(false),
      answers: { ...EMPTY_PREFERENCES, minat: ['Beasiswa' as const] },
      step: 2,
    };
    saveFinderState('k', state);

    expect(loadFinderState('k', SAVED)).toEqual(state);
  });

  it('ignores stored data that is damaged or out of range', () => {
    window.sessionStorage.setItem('k', 'bukan json');
    expect(loadFinderState('k', EMPTY_PREFERENCES)).toEqual(freshFinderState(false));

    window.sessionStorage.setItem(
      'k',
      JSON.stringify({
        answers: EMPTY_PREFERENCES,
        step: 9,
        showResults: false,
        showProfileChoice: false,
      }),
    );
    expect(loadFinderState('k', EMPTY_PREFERENCES)).toEqual(freshFinderState(false));

    window.sessionStorage.setItem(
      'k',
      JSON.stringify({
        answers: { ...EMPTY_PREFERENCES, provinsi: 'jakarta' },
        step: 0,
        showResults: false,
        showProfileChoice: false,
      }),
    );
    expect(loadFinderState('k', EMPTY_PREFERENCES)).toEqual(freshFinderState(false));
  });

  it('needs at least one category before leaving the first step', () => {
    expect(canAdvance(0, EMPTY_PREFERENCES)).toBe(false);
    expect(canAdvance(0, SAVED)).toBe(true);
    expect(canAdvance(1, EMPTY_PREFERENCES)).toBe(true);
  });

  it('toggles an item in and out of a list', () => {
    expect(toggleItem(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleItem(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('summarises the answers with readable labels and caps the list', () => {
    const summary = summarizeAnswers(
      {
        provinsi: '31',
        kota: '3171',
        kegiatan: ['mahasiswa', 'usaha'],
        kegiatanLain: '',
        pendidikan: 'sarjana',
        minat: ['Pendidikan', 'Beasiswa', 'Kesehatan'],
      },
      REGIONS,
    );

    expect(summary.shown).toEqual([
      'Pendidikan',
      'Beasiswa',
      'Kesehatan',
      'Mahasiswa',
      'Memiliki usaha',
      'DKI Jakarta, Jakarta Selatan',
    ]);
    expect(summary.hidden).toBe(1);
  });

  it('summarises without a region name while the region list is not loaded', () => {
    const summary = summarizeAnswers({ ...SAVED, provinsi: '31' }, null);

    expect(summary.shown).toEqual(['Pendidikan', 'Mahasiswa']);
  });
});
