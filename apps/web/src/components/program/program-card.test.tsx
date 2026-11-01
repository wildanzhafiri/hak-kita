import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { ProgramCard } from './program-card';

describe('ProgramCard', () => {
  it('shows the name, summary, and category without temporary status labels', () => {
    render(<ProgramCard program={makeProgram({ cakupan: { level: 'provinsi', kode: '32' } })} />);
    expect(screen.getByText('Program Contoh')).toBeTruthy();
    expect(screen.getByText('Ringkasan program contoh untuk pengujian.')).toBeTruthy();
    expect(screen.getByText('Pendidikan')).toBeTruthy();
    expect(screen.queryByText('Terverifikasi dasar')).toBeNull();
    expect(screen.queryByText(/Periode:/)).toBeNull();
  });

  it('links programs to the program route', () => {
    render(<ProgramCard program={makeProgram({ id: 'pkh' })} />);
    const link = screen.getByRole('link', { name: 'Program Contoh' });
    expect(link.getAttribute('href')).toBe('/program/pkh');
  });

  it('links administrative services to the service route', () => {
    render(
      <ProgramCard program={makeProgram({ id: 'ktp-el', kategori: 'Layanan Administrasi' })} />,
    );
    const link = screen.getByRole('link', { name: 'Program Contoh' });
    expect(link.getAttribute('href')).toBe('/layanan/ktp-el');
  });
});
