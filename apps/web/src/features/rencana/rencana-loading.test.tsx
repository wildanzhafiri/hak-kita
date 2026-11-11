import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RencanaLoading } from './rencana-loading';

describe('RencanaLoading', () => {
  it('tells the person Rencanaku is loading while keeping the page heading', () => {
    render(<RencanaLoading />);

    const status = screen.getByRole('status');
    expect(status.textContent).toContain('Memuat Rencanaku');
    expect(status.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Rencanaku', level: 1 })).toBeTruthy();
  });
});
