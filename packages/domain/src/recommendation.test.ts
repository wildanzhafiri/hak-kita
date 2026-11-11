import { describe, expect, it } from 'vitest';
import type { PreferensiProfil } from '@hakkita/schema';
import {
  EMPTY_PREFERENCES,
  hasPreferences,
  preferredWilayah,
  profileCompleteness,
  recommendPrograms,
} from './recommendation';
import { makeProgram, TODAY, WILAYAH_LIST } from './test-helpers';
import { buildWilayahIndex } from './wilayah';

const index = buildWilayahIndex(WILAYAH_LIST);
const options = { today: TODAY, wilayahIndex: index };

function preferences(overrides: Partial<PreferensiProfil> = {}): PreferensiProfil {
  return { ...EMPTY_PREFERENCES, ...overrides };
}

describe('profile completeness', () => {
  it('is empty until something is chosen', () => {
    expect(hasPreferences(EMPTY_PREFERENCES)).toBe(false);
    expect(profileCompleteness(EMPTY_PREFERENCES)).toBe('kosong');
  });

  it('is partial with only a region or only an interest', () => {
    expect(profileCompleteness(preferences({ provinsi: '32' }))).toBe('sebagian');
    expect(profileCompleteness(preferences({ minat: ['Pendidikan'] }))).toBe('sebagian');
  });

  it('is enough once an interest is paired with an activity or education level', () => {
    expect(profileCompleteness(preferences({ minat: ['Pendidikan'], kegiatan: ['pelajar'] }))).toBe(
      'cukup',
    );
    expect(profileCompleteness(preferences({ minat: ['Pendidikan'], pendidikan: 'sma' }))).toBe(
      'cukup',
    );
  });

  it('prefers the city over the province as the saved region', () => {
    expect(preferredWilayah(preferences({ provinsi: '32', kota: '3273' }))).toBe('3273');
    expect(preferredWilayah(preferences({ provinsi: '32' }))).toBe('32');
    expect(preferredWilayah(EMPTY_PREFERENCES)).toBeNull();
  });
});

describe('recommendPrograms', () => {
  const education = makeProgram({
    id: 'pendidikan',
    nama: 'Bantuan Kuliah',
    kategori: 'Pendidikan',
  });
  const health = makeProgram({ id: 'kesehatan', nama: 'Layanan Sehat', kategori: 'Kesehatan' });

  it('returns nothing when no preference points at a program', () => {
    expect(recommendPrograms([education, health], EMPTY_PREFERENCES, options)).toEqual([]);
  });

  it('keeps only programs in a chosen interest and explains why', () => {
    const results = recommendPrograms(
      [education, health],
      preferences({ minat: ['Pendidikan'] }),
      options,
    );

    expect(results.map((result) => result.program.id)).toEqual(['pendidikan']);
    expect(results[0]?.reasons).toContain('Bidang Pendidikan sesuai dengan minat yang kamu pilih.');
  });

  it('matches the target group of a program to the chosen activities', () => {
    const jobSeeker = makeProgram({
      id: 'prakerja',
      kategori: 'Pekerjaan & Pelatihan',
      kriteria: [{ kelompok: ['pencari-kerja'], syaratIndex: 0 }],
    });

    const results = recommendPrograms(
      [jobSeeker, education],
      preferences({ kegiatan: ['mencari-kerja'] }),
      options,
    );

    expect(results.map((result) => result.program.id)).toEqual(['prakerja']);
    expect(results[0]?.reasons).toContain('Sasaran program mencakup kegiatan yang kamu pilih.');
  });

  it('treats a school pupil with a high-school level as a future student', () => {
    const futureStudent = makeProgram({
      id: 'kip',
      kriteria: [{ kelompok: ['calon-mahasiswa'], syaratIndex: 0 }],
    });

    const withLevel = recommendPrograms(
      [futureStudent],
      preferences({ kegiatan: ['pelajar'], pendidikan: 'sma' }),
      options,
    );
    const withoutLevel = recommendPrograms(
      [futureStudent],
      preferences({ kegiatan: ['pelajar'] }),
      options,
    );

    expect(withLevel).toHaveLength(1);
    expect(withoutLevel).toHaveLength(0);
  });

  it('matches the education level when the program lists levels', () => {
    const scholarship = makeProgram({ id: 'beasiswa', kategori: 'Beasiswa', jenjang: ['S1'] });

    const results = recommendPrograms(
      [scholarship],
      preferences({ pendidikan: 'sarjana' }),
      options,
    );

    expect(results[0]?.reasons).toContain('Jenjang pendidikan program sesuai dengan jenjangmu.');
  });

  it('hides regional programs outside the saved region and when no region is saved', () => {
    const bandung = makeProgram({
      id: 'bandung',
      cakupan: { level: 'kabkota', kode: '3273' },
    });
    const minat = { minat: ['Pendidikan' as const] };

    expect(
      recommendPrograms(
        [bandung],
        preferences({ ...minat, provinsi: '32', kota: '3273' }),
        options,
      ),
    ).toHaveLength(1);
    expect(
      recommendPrograms([bandung], preferences({ ...minat, provinsi: '32' }), options),
    ).toHaveLength(0);
    expect(
      recommendPrograms([bandung], preferences({ ...minat, provinsi: '31' }), options),
    ).toHaveLength(0);
    expect(recommendPrograms([bandung], preferences(minat), options)).toHaveLength(0);
  });

  it('ranks a local program above a national one with the same match', () => {
    const national = makeProgram({ id: 'nasional', nama: 'Aaa Nasional' });
    const local = makeProgram({
      id: 'jabar',
      nama: 'Bbb Jawa Barat',
      cakupan: { level: 'provinsi', kode: '32' },
    });

    const results = recommendPrograms(
      [national, local],
      preferences({ minat: ['Pendidikan'], provinsi: '32' }),
      options,
    );

    expect(results.map((result) => result.program.id)).toEqual(['jabar', 'nasional']);
    expect(results[0]?.reasons).toContain('Berlaku di Jawa Barat.');
    expect(results[1]?.checks).toContain(
      'Cakupan program nasional; lokasi pelaksanaan tetap perlu kamu periksa.',
    );
  });

  it('keeps a closed program but ranks it lower and tells the person to check the schedule', () => {
    const closed = makeProgram({
      id: 'tutup',
      nama: 'Aaa Tutup',
      periode: { buka: '2026-01-01', tutup: '2026-02-01' },
    });
    const open = makeProgram({ id: 'buka', nama: 'Bbb Buka' });

    const results = recommendPrograms(
      [closed, open],
      preferences({ minat: ['Pendidikan'] }),
      options,
    );

    expect(results.map((result) => result.program.id)).toEqual(['buka', 'tutup']);
    expect(results[1]?.periodStatus).toBe('ditutup');
    expect(results[1]?.checks).toContain(
      'Periode yang tercatat sudah ditutup. Periksa jadwal terbaru.',
    );
  });

  it('skips services and programs whose details are not verified yet', () => {
    const service = makeProgram({
      id: 'layanan',
      jenis: 'layanan',
      kategori: 'Kependudukan & Dokumen Pribadi',
    });
    const unverified = makeProgram({
      id: 'belum',
      verifikasi: 'belum',
      tanggalDiperiksa: undefined,
    });

    const results = recommendPrograms(
      [service, unverified],
      preferences({ minat: ['Pendidikan'] }),
      options,
    );

    expect(results).toEqual([]);
  });
});
