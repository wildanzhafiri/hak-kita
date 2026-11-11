import { childrenOfWilayah } from '@hakkita/domain';
import type { Wilayah } from '@hakkita/schema';
import type { ProfileRegions, RegionOption } from './types';

function toOption(region: Wilayah): RegionOption {
  return { kode: region.kode, nama: region.nama };
}

export function buildProfileRegions(wilayah: readonly Wilayah[]): ProfileRegions {
  const provinces = childrenOfWilayah(wilayah, 'ID').map(toOption);
  const citiesByProvince = Object.fromEntries(
    provinces.map((province) => [
      province.kode,
      childrenOfWilayah(wilayah, province.kode).map(toOption),
    ]),
  );
  return { provinces, citiesByProvince };
}

export function describeRegion(
  regions: ProfileRegions,
  provinceCode: string | null,
  cityCode: string | null,
): string {
  const province = regions.provinces.find((entry) => entry.kode === provinceCode)?.nama;
  const city = provinceCode
    ? regions.citiesByProvince[provinceCode]?.find((entry) => entry.kode === cityCode)?.nama
    : undefined;
  return [province, city].filter(Boolean).join(', ');
}
