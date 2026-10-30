import { describe, expect, it } from 'vitest';
import { KODE_NASIONAL as SCHEMA_KODE_NASIONAL, type Wilayah } from '@hakkita/schema';
import { KODE_NASIONAL } from './constants';
import { WILAYAH_LIST } from './test-helpers';
import {
  appliesIn,
  buildWilayahIndex,
  childrenOfWilayah,
  validateWilayahList,
  wilayahChain,
  wilayahName,
} from './wilayah';

const index = buildWilayahIndex(WILAYAH_LIST);

describe('KODE_NASIONAL', () => {
  it('matches the schema constant, which domain does not import to keep zod out of the bundle', () => {
    expect(KODE_NASIONAL).toBe(SCHEMA_KODE_NASIONAL);
  });
});

describe('wilayahChain', () => {
  it('walks from regency to province to national', () => {
    expect(wilayahChain(index, '3205')).toEqual(['3205', '32', 'ID']);
  });

  it('returns an empty chain for an unknown code', () => {
    expect(wilayahChain(index, '9999')).toEqual([]);
  });

  it('stops on a parent cycle', () => {
    const cyclic = buildWilayahIndex([
      { kode: '31', nama: 'A', level: 'provinsi', parent: '32' },
      { kode: '32', nama: 'B', level: 'provinsi', parent: '31' },
    ]);
    expect(wilayahChain(cyclic, '31')).toEqual(['31', '32']);
  });
});

describe('appliesIn', () => {
  it('shows every program when no region is selected', () => {
    expect(appliesIn('3273', null, index)).toBe(true);
  });

  it('applies a national program in any region', () => {
    expect(appliesIn('ID', '3205', index)).toBe(true);
  });

  it('applies a province program to regencies inside it', () => {
    expect(appliesIn('32', '3205', index)).toBe(true);
  });

  it('does not apply a program from another province', () => {
    expect(appliesIn('31', '3205', index)).toBe(false);
  });

  it('does not apply a regency program to a sibling regency', () => {
    expect(appliesIn('3273', '3205', index)).toBe(false);
  });

  it('does not apply a regency program when only the province is selected', () => {
    expect(appliesIn('3205', '32', index)).toBe(false);
  });
});

describe('childrenOfWilayah', () => {
  it('sorts children by name', () => {
    expect(childrenOfWilayah(WILAYAH_LIST, '32').map((w) => w.kode)).toEqual(['3205', '3273']);
  });

  it('returns nothing for a region without children', () => {
    expect(childrenOfWilayah(WILAYAH_LIST, '3205')).toEqual([]);
  });
});

describe('wilayahName', () => {
  it('returns the name of a known region', () => {
    expect(wilayahName(index, '32')).toBe('Jawa Barat');
  });

  it('falls back to the code when the region is unknown', () => {
    expect(wilayahName(index, '99')).toBe('99');
  });
});

describe('validateWilayahList', () => {
  it('accepts a consistent list', () => {
    expect(validateWilayahList(WILAYAH_LIST)).toEqual([]);
  });

  it('detects duplicate codes', () => {
    const errors = validateWilayahList([...WILAYAH_LIST, WILAYAH_LIST[1] as Wilayah]);
    expect(errors.some((e) => e.includes('Kode ganda: 31'))).toBe(true);
  });

  it('detects a missing parent', () => {
    const errors = validateWilayahList([
      ...WILAYAH_LIST,
      { kode: '3571', nama: 'Kota Kediri', level: 'kabkota', parent: '35' },
    ]);
    expect(errors.some((e) => e.includes('parent "35" tidak ditemukan'))).toBe(true);
  });

  it('requires exactly one national region', () => {
    const errors = validateWilayahList(WILAYAH_LIST.slice(1));
    expect(errors.some((e) => e.includes('tepat satu wilayah nasional'))).toBe(true);
  });
});
