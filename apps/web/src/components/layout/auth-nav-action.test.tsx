import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthNavAction } from './auth-nav-action';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));
vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: { id: 'user-1' } }) }));
vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({ auth: { signOut: mocks.signOut } }),
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onPress, isDisabled }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
  }) => (
    <button disabled={isDisabled} onClick={onPress} type="button">
      {children}
    </button>
  ),
}));
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ trigger, open, title, children }: {
    trigger: React.ReactNode;
    open: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <>
      {trigger}
      {open && (
        <div aria-label={title} role="dialog">
          <h2>{title}</h2>
          {children}
        </div>
      )}
    </>
  ),
}));

describe('AuthNavAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('confirms sign out before returning to the home page', async () => {
    mocks.signOut.mockResolvedValue({ error: null });
    render(<AuthNavAction currentPath="/rencanaku" />);

    fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
    expect(screen.getByRole('dialog', { name: 'Keluar dari akun?' })).toBeTruthy();
    expect(mocks.signOut).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Ya, keluar' }));

    expect(await screen.findByRole('button', { name: 'Sedang keluar…' })).toBeTruthy();
    await vi.waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/'));
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it('keeps the confirmation open when sign out fails', async () => {
    mocks.signOut.mockResolvedValue({ error: new Error('failed') });
    render(<AuthNavAction currentPath="/rencanaku" />);

    fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ya, keluar' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Kamu belum berhasil keluar. Coba lagi.',
    );
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Keluar dari akun?' })).toBeTruthy();
  });
});
