import { describe, expect, it } from 'vitest';
import { AUDIENCE_OPTIONS } from './constants';
import { audienceGroups } from './audience';

describe('audience groups', () => {
  it('folds very specific targets into the shared target list', () => {
    expect(
      audienceGroups({ untuk: ['Calon mahasiswa baru berprestasi asal Padang Pariaman'] }),
    ).toEqual(['Mahasiswa']);
    expect(audienceGroups({ untuk: ['Siswa SMA atau SMK dari Kabupaten Badung'] })).toEqual([
      'Pelajar',
    ]);
    expect(audienceGroups({ untuk: ['Lulusan SMA sederajat dari keluarga kurang mampu'] })).toEqual(
      ['Lulusan Baru'],
    );
    expect(audienceGroups({ untuk: ['Pelaku usaha mikro dan kecil perseorangan'] })).toEqual([
      'Pelaku UMKM',
    ]);
  });

  it('tells job seekers from workers', () => {
    expect(audienceGroups({ untuk: ['Warga Kabupaten Tabalong yang ingin bekerja'] })).toEqual([
      'Pencari Kerja',
    ]);
    expect(audienceGroups({ untuk: ['Pencari kerja dan masyarakat umum'] })).toEqual([
      'Pencari Kerja',
    ]);
    expect(audienceGroups({ untuk: ['Pekerja mandiri atau Bukan Penerima Upah'] })).toEqual([
      'Pekerja',
    ]);
  });

  it('puts a student from a poor family under students, not families', () => {
    expect(audienceGroups({ untuk: ['Mahasiswa dari keluarga kurang mampu'] })).toEqual([
      'Mahasiswa',
    ]);
    expect(audienceGroups({ untuk: ['Peserta didik usia sekolah dari keluarga miskin'] })).toEqual([
      'Pelajar',
    ]);
  });

  it('treats household and low-income targets as one group', () => {
    expect(audienceGroups({ untuk: ['Keluarga', 'Orang tua atau wali'] })).toEqual(['Keluarga']);
    expect(audienceGroups({ untuk: ['Penduduk pada desil kesejahteraan 5'] })).toEqual([
      'Keluarga',
    ]);
  });

  it('recognises farmers, older people and people with disabilities', () => {
    expect(audienceGroups({ untuk: ['Petani penggarap'] })).toEqual(['Petani']);
    expect(audienceGroups({ untuk: ['Lansia di atas 60 tahun'] })).toEqual(['Lansia']);
    expect(audienceGroups({ untuk: ['Penyandang disabilitas berat'] })).toEqual([
      'Penyandang Disabilitas',
    ]);
  });

  it('falls back to the general public for service roles', () => {
    expect(audienceGroups({ untuk: ['Wajib pajak orang pribadi'] })).toEqual(['Masyarakat Umum']);
    expect(audienceGroups({ untuk: ['Peserta JKN aktif', 'Penduduk WNI'] })).toEqual([
      'Masyarakat Umum',
    ]);
  });

  it('lists a program under every group its targets fall into', () => {
    expect(
      audienceGroups({ untuk: ['Pencari kerja dan masyarakat umum', 'Mahasiswa aktif'] }),
    ).toEqual(['Pencari Kerja', 'Mahasiswa']);
  });

  it('only ever produces a group that the filter offers', () => {
    const groups = audienceGroups({
      untuk: ['Mahasiswa', 'Siswa', 'Lulusan SMA', 'Petani', 'Wajib pajak'],
    });

    expect(groups.every((group) => AUDIENCE_OPTIONS.includes(group))).toBe(true);
  });
});
