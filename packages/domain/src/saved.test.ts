import { describe, expect, it } from 'vitest';
import { parseSavedIds, serializeSavedIds, toggleSavedId } from './saved';

describe('parseSavedIds', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(parseSavedIds(null)).toEqual([]);
  });

  it('survives corrupted storage', () => {
    expect(parseSavedIds('{rusak')).toEqual([]);
    expect(parseSavedIds('{"a":1}')).toEqual([]);
  });

  it('keeps only unique string ids', () => {
    expect(parseSavedIds('["pkh", 3, "pkh", "kip-kuliah"]')).toEqual(['pkh', 'kip-kuliah']);
  });

  it('round-trips through serialize', () => {
    const ids = ['pkh', 'kip-kuliah'];
    expect(parseSavedIds(serializeSavedIds(ids))).toEqual(ids);
  });
});

describe('toggleSavedId', () => {
  it('adds an id that is not saved yet', () => {
    expect(toggleSavedId(['pkh'], 'kip-kuliah')).toEqual(['pkh', 'kip-kuliah']);
  });

  it('removes an id that is already saved', () => {
    expect(toggleSavedId(['pkh', 'kip-kuliah'], 'pkh')).toEqual(['kip-kuliah']);
  });
});
