import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SourceInformationList } from './source-information-list';
import type { SourceInformationEntry } from './types';

const ENTRIES: SourceInformationEntry[] = Array.from({ length: 7 }, (_, index) => ({
  id: `program-${index + 1}`,
  name: `Program ${index + 1}`,
  agency: 'Instansi Pemerintah',
  checkedAt: '2026-11-10',
  sourceUrl: `https://contoh.go.id/program-${index + 1}`,
}));

describe('SourceInformationList', () => {
  it('paginates source entries', () => {
    render(<SourceInformationList entries={ENTRIES} />);

    expect(screen.getByText('Program 1')).not.toBeNull();
    expect(screen.queryByText('Program 7')).toBeNull();
    expect(screen.getByText('Menampilkan 1–6 dari 7 informasi')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Halaman 2' }));

    expect(screen.getByText('Program 7')).not.toBeNull();
    expect(screen.queryByText('Program 1')).toBeNull();
    expect(screen.getByText('Menampilkan 7–7 dari 7 informasi')).not.toBeNull();
  });
});
