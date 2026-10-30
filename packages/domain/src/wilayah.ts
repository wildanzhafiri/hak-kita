import type { Wilayah } from '@hakkita/schema';
import { KODE_NASIONAL } from './constants';
import type { WilayahIndex } from './types';

export function buildWilayahIndex(list: readonly Wilayah[]): WilayahIndex {
  return new Map(list.map((w) => [w.kode, w]));
}

export function wilayahChain(index: WilayahIndex, kode: string): string[] {
  const chain: string[] = [];
  const seen = new Set<string>();
  let current: string | null | undefined = kode;
  while (current && !seen.has(current)) {
    const wilayah = index.get(current);
    if (!wilayah) break;
    chain.push(current);
    seen.add(current);
    current = wilayah.parent;
  }
  return chain;
}

export function appliesIn(
  cakupanKode: string,
  selectedWilayah: string | null,
  index: WilayahIndex,
): boolean {
  if (selectedWilayah === null) return true;
  if (cakupanKode === KODE_NASIONAL) return true;
  return wilayahChain(index, selectedWilayah).includes(cakupanKode);
}

export function childrenOfWilayah(list: readonly Wilayah[], parent: string): Wilayah[] {
  return list.filter((w) => w.parent === parent).sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
}

export function wilayahName(index: WilayahIndex, kode: string): string {
  return index.get(kode)?.nama ?? kode;
}

export function validateWilayahList(list: readonly Wilayah[]): string[] {
  const errors: string[] = [];
  const codes = new Set<string>();
  for (const w of list) {
    if (codes.has(w.kode)) errors.push(`Kode ganda: ${w.kode}`);
    codes.add(w.kode);
  }
  const national = list.filter((w) => w.level === 'nasional');
  if (national.length !== 1) {
    errors.push(`Harus tepat satu wilayah nasional (ditemukan ${national.length})`);
  }
  for (const w of list) {
    if (w.parent !== null && !codes.has(w.parent)) {
      errors.push(`${w.kode}: parent "${w.parent}" tidak ditemukan`);
    }
  }
  return errors;
}
