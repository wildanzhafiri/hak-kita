import { render, screen } from '@testing-library/react';
import { buildWilayahIndex } from '@hakkita/domain';
import { describe, expect, it } from 'vitest';
import { BUILT_ON, WILAYAH, makeProgram } from '@/test/fixtures';
import { ProgramCard } from './program-card';

const index = buildWilayahIndex(WILAYAH);

describe('ProgramCard', () => {
  it('shows the name, summary, region, and verification level', () => {
    render(
      <ProgramCard
        program={makeProgram({ cakupan: { level: 'provinsi', kode: '32' } })}
        index={index}
        today={BUILT_ON}
      />,
    );
    expect(screen.getByText('Program Contoh')).toBeTruthy();
    expect(screen.getByText('Ringkasan program contoh untuk pengujian.')).toBeTruthy();
    expect(screen.getByText('Jawa Barat')).toBeTruthy();
    expect(screen.getByText('Terverifikasi dasar')).toBeTruthy();
  });

  it('links programs to Kenali Hakmu', () => {
    render(<ProgramCard program={makeProgram({ id: 'pkh' })} index={index} today={BUILT_ON} />);
    const link = screen.getByRole('link', { name: 'Program Contoh' });
    expect(link.getAttribute('href')).toBe('/kenali-hakmu/pkh');
  });

  it('links administrative services to Urus Kebutuhanmu', () => {
    render(
      <ProgramCard
        program={makeProgram({ id: 'ktp-el', kategori: 'Layanan Administrasi' })}
        index={index}
        today={BUILT_ON}
      />,
    );
    const link = screen.getByRole('link', { name: 'Program Contoh' });
    expect(link.getAttribute('href')).toBe('/urus-kebutuhanmu/ktp-el');
  });
});
