import { ProgramSchema, type Program, type Wilayah } from '@hakkita/schema';

export const TODAY = '2026-10-30';

export const WILAYAH_LIST: Wilayah[] = [
  { kode: 'ID', nama: 'Nasional', level: 'nasional', parent: null },
  { kode: '31', nama: 'DKI Jakarta', level: 'provinsi', parent: 'ID' },
  { kode: '32', nama: 'Jawa Barat', level: 'provinsi', parent: 'ID' },
  { kode: '3205', nama: 'Kabupaten Garut', level: 'kabkota', parent: '32' },
  { kode: '3273', nama: 'Kota Bandung', level: 'kabkota', parent: '32' },
];

export function makeProgram(overrides: Partial<Program> = {}): Program {
  return ProgramSchema.parse({
    id: 'contoh',
    nama: 'Program Contoh',
    kategori: 'Pendidikan',
    penyelenggara: 'Kementerian Contoh',
    ringkasan: 'Ringkasan program contoh untuk pengujian.',
    untuk: ['Warga'],
    cakupan: { level: 'nasional', kode: 'ID' },
    tipeGerbang: 'kategori',
    syarat: [{ teks: 'Syarat contoh', sumberUrl: 'https://contoh.go.id/syarat' }],
    sumberUtama: { url: 'https://contoh.go.id/', jenis: 'situs-resmi' },
    verifikasi: 'dasar',
    tanggalDiperiksa: '2026-10-20',
    ...overrides,
  });
}
