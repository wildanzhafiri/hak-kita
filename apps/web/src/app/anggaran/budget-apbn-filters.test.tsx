import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BudgetApbnFilters } from './budget-apbn-filters';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('BudgetApbnFilters', () => {
  it('changes the selected year through the page route', async () => {
    render(<BudgetApbnFilters year={2026} />);

    const yearSelect = screen.getAllByRole('button')[0];
    if (!yearSelect) throw new Error('Filter tahun tidak ditemukan.');
    fireEvent.click(yearSelect);
    fireEvent.click(await screen.findByRole('option', { name: '2025' }));

    expect(push).toHaveBeenCalledWith('/anggaran?scope=apbn&year=2025');
  });
});
