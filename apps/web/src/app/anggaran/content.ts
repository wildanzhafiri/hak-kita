import type { BudgetMetric } from './types';

export const ANGGARAN_CONTENT = {
  breadcrumbs: [{ label: 'Telusuri Anggaran' }],
  eyebrow: 'TELUSURI ANGGARAN',
  title: 'Pahami ke mana uang publik digunakan.',
  description: 'Lihat ringkasan APBN dan perkembangan alokasi serta realisasi belanja daerah.',
  sectionTitle: 'Ringkasan APBN 2026',
  reportingPeriod: 'Realisasi sampai 30 September 2026',
  checkedDate: 'Diperiksa 1 November 2026',
  apbnSourceLabel: 'APBN KiTa edisi Oktober 2026 di situs Kementerian Keuangan',
  apbnSourceUrl: 'https://www.kemenkeu.go.id/APBNKITAOktober2026',
  apbdTitle: 'Telusuri APBD daerah',
  apbdDescription:
    'Pilih tahun, periode, provinsi, dan kabupaten atau kota di Portal Data SIKD Kementerian Keuangan.',
  apbdSourceLabel: 'Sumber: Portal Data APBD SIKD, Kementerian Keuangan',
  apbdSourceUrl:
    'https://djpk.kemenkeu.go.id/portal/data/apbd?pemda=--&periode=12&provinsi=--&tahun=2026',
  compositionTitle: 'Komposisi Belanja Daerah',
  compositionUnit: 'Dalam miliar rupiah (M)',
  compositionSourceLabel: 'Sumber: Portal Data SIKD, DJPK Kementerian Keuangan',
  readingNote:
    'Persentase realisasi menunjukkan perbandingan dengan target atau pagu. Angka ini tidak menjelaskan sendiri siapa yang menerima manfaat atau dampak layanan.',
};

export const APBN_METRICS: readonly BudgetMetric[] = [
  { label: 'Pendapatan negara', value: 'Rp2.341,5 T', detail: '74,2% dari target' },
  { label: 'Belanja negara', value: 'Rp2.660,5 T', detail: '69,2% dari pagu' },
  { label: 'Defisit APBN', value: '1,24%', detail: 'terhadap PDB' },
  { label: 'Keseimbangan primer', value: 'Surplus Rp125,5 T', detail: 'per 30 September 2026' },
];
