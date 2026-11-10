import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BudgetFilters } from './budget-filters';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

describe('BudgetFilters', () => {
  it('loads the selected province and resets the region to an unselected state', async () => {
    render(
      <BudgetFilters
        filters={{
          years: [
            { value: '2026', label: '2026' },
            { value: '2025', label: '2025' },
          ],
          periods: [{ value: '11', label: 'November' }],
          provinces: [
            { value: '--', label: 'Nasional' },
            { value: '09', label: 'Provinsi DKI Jakarta' },
          ],
          regions: [],
          maxPeriod: 11,
        }}
        selectedYear={2026}
        selectedProvince="--"
        selectedRegion=""
      />,
    );

    const provinceSelect = screen.getAllByRole('button')[1];
    if (!provinceSelect) throw new Error('Filter provinsi tidak ditemukan.');
    fireEvent.click(provinceSelect);
    fireEvent.click(await screen.findByRole('option', { name: 'Provinsi DKI Jakarta' }));

    expect(push).toHaveBeenCalledWith('/anggaran?scope=apbd&year=2026&province=09');
  });
});
