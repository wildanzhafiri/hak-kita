import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataTable } from './data-table';

describe('DataTable', () => {
  it('renders the column headers and one row per entry', () => {
    render(
      <DataTable
        columns={['Tingkat', 'Jumlah']}
        rows={[
          { key: 'a', cells: ['Lengkap', 2] },
          { key: 'b', cells: ['Belum', 5] },
        ]}
      />,
    );
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Tingkat',
      'Jumlah',
    ]);
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('uses the first cell of each row as the row header', () => {
    render(
      <DataTable columns={['Tingkat', 'Jumlah']} rows={[{ key: 'a', cells: ['Lengkap', 2] }]} />,
    );
    const row = screen.getAllByRole('row')[1] as HTMLElement;
    expect(within(row).getByRole('rowheader').textContent).toBe('Lengkap');
    expect(within(row).getByRole('cell').textContent).toBe('2');
  });
});
