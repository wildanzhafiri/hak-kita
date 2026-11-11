import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PrivasiPage from './page';

describe('PrivasiPage', () => {
  it('shows the title, the subtitle and the three sections of the privacy page', () => {
    render(<PrivasiPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pilihanmu tetap dalam kendalimu.' }),
    ).toBeTruthy();
    expect(
      screen.getByText('Cara Hakkita memperlakukan informasi yang kamu gunakan.'),
    ).toBeTruthy();
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(['Data di perangkatmu', 'Tanpa dokumen pribadi', 'Tautan ke situs lain']);
  });

  it('puts the page under Beranda in the trail', () => {
    render(<PrivasiPage />);

    expect(screen.getByRole('link', { name: 'Beranda' }).getAttribute('href')).toBe('/');
  });
});
