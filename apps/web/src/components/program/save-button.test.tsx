import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SaveButton } from './save-button';

const { authState, savedState } = vi.hoisted(() => ({
  authState: { user: null as { id: string } | null, isReady: true, isConfigured: true },
  savedState: {
    ids: [] as string[],
    toggle: vi.fn<() => Promise<void>>(),
    clear: vi.fn<() => Promise<void>>(),
    isLoading: false,
    isSaving: false,
    error: null as string | null,
  },
}));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => authState }));
vi.mock('@/hooks/use-saved-ids', () => ({ useSavedIds: () => savedState }));

const PROGRAM = { id: 'pkh', nama: 'PKH' };

describe('SaveButton', () => {
  beforeEach(() => {
    authState.user = null;
    savedState.ids = [];
    savedState.error = null;
    savedState.toggle.mockClear();
  });

  it('asks the visitor to sign in before saving a program', () => {
    render(<SaveButton program={PROGRAM} />);
    const button = screen.getByRole('button', { name: 'Simpan PKH' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.classList.contains('button--ghost')).toBe(true);
    expect(button.classList.contains('button--icon-only')).toBe(true);
    expect(button.classList.contains('save-button')).toBe(true);

    fireEvent.click(button);
    expect(screen.getByRole('dialog', { name: 'Simpan program ke akunmu' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Masuk' }).getAttribute('href')).toContain('save=pkh');
    expect(savedState.toggle).not.toHaveBeenCalled();
  });

  it('saves for the signed-in account', () => {
    authState.user = { id: 'user-1' };
    render(<SaveButton program={PROGRAM} />);
    fireEvent.click(screen.getByRole('button', { name: 'Simpan PKH' }));
    expect(savedState.toggle).toHaveBeenCalledWith('pkh');
  });

  it('shows the account prompt in the detail sidebar variant', () => {
    render(<SaveButton program={PROGRAM} variant="button" />);
    fireEvent.click(screen.getByRole('button', { name: /Simpan ke Rencanaku/ }));
    expect(screen.getByRole('dialog', { name: 'Simpan program ke akunmu' })).toBeTruthy();
  });

  it('does not render account errors inside each program card button', () => {
    authState.user = { id: 'user-1' };
    savedState.error = 'Simpanan akun belum dapat dimuat. Coba muat ulang halaman.';
    render(<SaveButton program={PROGRAM} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
