import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectField } from './select-field';

describe('SelectField', () => {
  it('shows a check only beside the selected option', async () => {
    render(
      <SelectField
        label="Wilayah"
        placeholder="Semua wilayah"
        value="__all__"
        options={[
          { value: '__all__', label: 'Semua wilayah' },
          { value: 'di-yogyakarta', label: 'DI Yogyakarta' },
          { value: 'dki-jakarta', label: 'DKI Jakarta' },
        ]}
        onChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    const allOption = await screen.findByRole('option', { name: 'Semua wilayah' });
    const yogyakartaOption = screen.getByRole('option', { name: 'DI Yogyakarta' });
    const jakartaOption = screen.getByRole('option', { name: 'DKI Jakarta' });

    expect(allOption.querySelector('svg')).toBeTruthy();
    expect(yogyakartaOption.querySelector('svg')).toBeNull();
    expect(jakartaOption.querySelector('svg')).toBeNull();
  });
});
