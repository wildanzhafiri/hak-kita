import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SAVED_STORAGE_KEY } from '@/config/storage';
import { SaveButton } from './save-button';

const PROGRAM = { id: 'pkh', nama: 'PKH' };

describe('SaveButton', () => {
  it('saves and unsaves a program on the device', () => {
    render(<SaveButton program={PROGRAM} />);
    const button = screen.getByRole('button', { name: 'Simpan PKH' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList.contains('button--ghost')).toBe(true);
    expect(button.classList.contains('button--icon-only')).toBe(true);
    expect(button.classList.contains('save-button')).toBe(true);

    fireEvent.click(button);
    const savedButton = screen.getByRole('button', { name: 'Hapus PKH dari Rencanaku' });
    expect(savedButton).toBeTruthy();
    expect(savedButton.querySelector('svg')?.getAttribute('fill')).toBe('currentColor');
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('["pkh"]');

    fireEvent.click(screen.getByRole('button', { name: 'Hapus PKH dari Rencanaku' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('[]');
  });

  it('restores the saved state on the next visit', () => {
    window.localStorage.setItem(SAVED_STORAGE_KEY, '["pkh"]');
    render(<SaveButton program={PROGRAM} />);
    expect(
      screen.getByRole('button', { name: 'Hapus PKH dari Rencanaku' }).getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('shows a labelled text button in the detail sidebar variant', () => {
    render(<SaveButton program={PROGRAM} variant="button" />);
    fireEvent.click(screen.getByRole('button', { name: /Simpan ke Rencanaku/ }));
    expect(screen.getByRole('button', { name: /Tersimpan di Rencanaku/ })).toBeTruthy();
  });
});
