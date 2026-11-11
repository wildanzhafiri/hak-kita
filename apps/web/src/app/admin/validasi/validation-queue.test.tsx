import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ValidationMetrics } from './validation-metrics';
import { ValidationQueue } from './validation-queue';
import type { ValidationItem } from './types';

function makeItem(index: number, overrides: Partial<ValidationItem> = {}): ValidationItem {
  return {
    id: `item-${index}`,
    finding: 'new',
    kind: 'program',
    name: `Informasi ${String(index).padStart(2, '0')}`,
    summary: `Ringkasan temuan ${index}`,
    detectedAt: '2026-11-10T03:00:00Z',
    ...overrides,
  };
}

describe('ValidationMetrics', () => {
  it('counts everything waiting, new information, and updates', () => {
    render(
      <ValidationMetrics items={[makeItem(1), makeItem(2), makeItem(3, { finding: 'update' })]} />,
    );

    expect(screen.getByText('Perlu diperiksa').nextElementSibling?.textContent).toBe('3');
    expect(screen.getByText('Informasi baru').nextElementSibling?.textContent).toBe('2');
    expect(screen.getByText('Pembaruan').nextElementSibling?.textContent).toBe('1');
  });
});

describe('ValidationQueue', () => {
  it('shows each finding with its type, summary, and a link to review it', () => {
    render(
      <ValidationQueue
        items={[makeItem(1, { kind: 'layanan', finding: 'update', id: 'abc-123' })]}
      />,
    );
    const table = within(screen.getByRole('table'));

    expect(table.getByText('Informasi 01')).toBeTruthy();
    expect(table.getByText('Layanan')).toBeTruthy();
    expect(table.getByText('Pembaruan')).toBeTruthy();
    expect(table.getByText('Ringkasan temuan 1')).toBeTruthy();
    expect(table.getByRole('link', { name: 'Periksa' }).getAttribute('href')).toBe(
      '/admin/validasi/abc-123',
    );
  });

  it('shows a calm message when nothing is waiting', () => {
    render(<ValidationQueue items={[]} />);

    expect(screen.getByText('Semua informasi sudah diperiksa')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('filters by search and by finding, and explains an empty result', () => {
    render(
      <ValidationQueue
        items={[makeItem(1), makeItem(2, { finding: 'update', name: 'Kabar Beasiswa' })]}
      />,
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'kabar' } });
    expect(screen.getByText('Kabar Beasiswa')).toBeTruthy();
    expect(screen.queryByText('Informasi 01')).toBeNull();

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'tidak ada' } });
    expect(screen.getByText('Tidak ada hasil yang sesuai')).toBeTruthy();
  });

  it('shows ten findings per page and moves between pages', () => {
    render(
      <ValidationQueue items={Array.from({ length: 23 }, (_, index) => makeItem(index + 1))} />,
    );

    expect(
      within(screen.getByRole('table')).getAllByRole('link', { name: 'Periksa' }),
    ).toHaveLength(10);
    fireEvent.click(screen.getByRole('button', { name: 'Halaman 3' }));
    expect(
      within(screen.getByRole('table')).getAllByRole('link', { name: 'Periksa' }),
    ).toHaveLength(3);
    expect(screen.getByText('Informasi 23')).toBeTruthy();
  });
});
