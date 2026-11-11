import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { PublishedInfo } from './published-info';

describe('PublishedInfo', () => {
  it('lists the published fields in the reference order and leaves empty ones blank', () => {
    const { container } = render(
      <PublishedInfo
        program={makeProgram({
          nama: 'KIP Kuliah',
          penyelenggara: 'Kementerian Pendidikan',
          langkah: ['Daftar di laman resmi', 'Tunggu verifikasi'],
          tentang: undefined,
        })}
        regionName="Nasional"
      />,
    );

    const labels = [...container.querySelectorAll('dt')].map((node) => node.textContent);
    expect(labels).toEqual([
      'Nama',
      'Kategori',
      'Deskripsi singkat',
      'Ringkasan informasi',
      'Instansi / penyelenggara',
      'Wilayah',
      'Untuk siapa',
      'Manfaat atau tujuan',
      'Persyaratan',
      'Dokumen',
      'Langkah / prosedur',
      'Jadwal pendaftaran',
      'Biaya',
      'Tautan resmi',
    ]);
    expect(screen.getByRole('heading', { name: 'Informasi terpublikasi' })).toBeTruthy();
    expect(screen.getByText('1. Daftar di laman resmi')).toBeTruthy();
    expect(screen.queryByText('Belum tersedia')).toBeNull();
  });

  it('shows each source with its quote when there is one', () => {
    render(
      <PublishedInfo
        program={makeProgram({
          sumberUtama: {
            url: 'https://contoh.go.id/program',
            jenis: 'situs-resmi',
            kutipan: 'Kutipan dari halaman program.',
          },
          sumberTambahan: [{ url: 'https://contoh.go.id/panduan', jenis: 'situs-resmi' }],
        })}
        regionName="Nasional"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Sumber Informasi' })).toBeTruthy();
    expect(screen.getByText(/Kutipan dari halaman program\./)).toBeTruthy();
    expect(screen.getAllByText('contoh.go.id')).toHaveLength(2);
  });
});
