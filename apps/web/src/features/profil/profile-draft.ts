import { JENJANG_PENDIDIKAN_PROFIL, PreferensiProfilSchema } from '@hakkita/schema';
import type { PreferensiProfil } from '@hakkita/schema';
import type { ProfileDraft, ProfileRegions } from './types';

export function createDraft(nama: string, preferensi: PreferensiProfil): ProfileDraft {
  return {
    nama,
    provinsi: preferensi.provinsi ?? '',
    kota: preferensi.kota ?? '',
    kegiatan: [...preferensi.kegiatan],
    kegiatanLain: preferensi.kegiatan.includes('lainnya') ? preferensi.kegiatanLain : '',
    pendidikan: preferensi.pendidikan ?? '',
    minat: [...preferensi.minat],
  };
}

export function draftToPreferences(draft: ProfileDraft, regions: ProfileRegions): PreferensiProfil {
  const hasProvince = regions.provinces.some((province) => province.kode === draft.provinsi);
  const hasCity =
    hasProvince &&
    Boolean(regions.citiesByProvince[draft.provinsi]?.some((city) => city.kode === draft.kota));
  const education = JENJANG_PENDIDIKAN_PROFIL.find((level) => level === draft.pendidikan) ?? null;
  return PreferensiProfilSchema.parse({
    provinsi: hasProvince ? draft.provinsi : null,
    kota: hasCity ? draft.kota : null,
    kegiatan: draft.kegiatan,
    kegiatanLain: draft.kegiatan.includes('lainnya') ? draft.kegiatanLain.trim() : '',
    pendidikan: education,
    minat: draft.minat,
  });
}

function signature(draft: ProfileDraft): string {
  return JSON.stringify({
    ...draft,
    nama: draft.nama.trim(),
    kegiatanLain: draft.kegiatanLain.trim(),
    kegiatan: [...draft.kegiatan].sort(),
    minat: [...draft.minat].sort(),
  });
}

export function isDraftDirty(draft: ProfileDraft, initial: ProfileDraft): boolean {
  return signature(draft) !== signature(initial);
}

export function toggleValue<Value extends string>(values: Value[], value: Value): Value[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}
