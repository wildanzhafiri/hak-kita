import {
  BerkasSchema,
  ProgramSchema,
  type Berkas,
  type Program,
  type Wilayah,
} from '@hakkita/schema';

export const BUILT_ON = '2026-10-30';

export const WILAYAH: Wilayah[] = [
  { kode: 'ID', nama: 'Nasional', level: 'nasional', parent: null },
  { kode: '31', nama: 'DKI Jakarta', level: 'provinsi', parent: 'ID' },
  { kode: '32', nama: 'Jawa Barat', level: 'provinsi', parent: 'ID' },
  { kode: '3205', nama: 'Kabupaten Garut', level: 'kabkota', parent: '32' },
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

const SOURCE_URL = 'https://contoh.go.id/panduan';

export const BERKAS: Berkas = BerkasSchema.parse({
  pertanyaan: [
    {
      id: 'ekonomi',
      teks: 'Apa dasar keterbatasan ekonomimu?',
      pilihan: [
        { nilai: 'kip', label: 'Saya punya KIP' },
        { nilai: 'penghasilan', label: 'Penghasilan di bawah UMP' },
      ],
    },
  ],
  dokumen: [
    { id: 'email', label: 'Alamat email aktif', sumberUrl: SOURCE_URL },
    {
      id: 'sktm',
      label: 'Surat Keterangan Tidak Mampu',
      kondisi: { pertanyaan: 'ekonomi', nilai: ['penghasilan'] },
      sumberUrl: SOURCE_URL,
    },
  ],
  kendala: [
    {
      masalah: 'NISN tidak dikenali',
      langkah: 'Minta operator sekolah memperbaiki data.',
      sumberUrl: SOURCE_URL,
    },
  ],
});
