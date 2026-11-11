import { describe, expect, it } from 'vitest';
import type { Wilayah } from '@hakkita/schema';
import { buildProfileRegions, describeRegion } from './profile-regions';

const wilayah: Wilayah[] = [
  { kode: 'ID', nama: 'Nasional', level: 'nasional', parent: null },
  { kode: '32', nama: 'Jawa Barat', level: 'provinsi', parent: 'ID' },
  { kode: '11', nama: 'Aceh', level: 'provinsi', parent: 'ID' },
  { kode: '3273', nama: 'Kota Bandung', level: 'kabkota', parent: '32' },
  { kode: '3205', nama: 'Kabupaten Garut', level: 'kabkota', parent: '32' },
];

describe('profile regions', () => {
  const regions = buildProfileRegions(wilayah);

  it('lists provinces and their cities in alphabetical order', () => {
    expect(regions.provinces.map((province) => province.nama)).toEqual(['Aceh', 'Jawa Barat']);
    expect(regions.citiesByProvince['32']?.map((city) => city.nama)).toEqual([
      'Kabupaten Garut',
      'Kota Bandung',
    ]);
    expect(regions.citiesByProvince['11']).toEqual([]);
  });

  it('describes a saved region by province and city', () => {
    expect(describeRegion(regions, '32', '3273')).toBe('Jawa Barat, Kota Bandung');
    expect(describeRegion(regions, '32', null)).toBe('Jawa Barat');
    expect(describeRegion(regions, null, null)).toBe('');
  });

  it('ignores a city that does not belong to the saved province', () => {
    expect(describeRegion(regions, '11', '3273')).toBe('Aceh');
  });
});
