import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignOutDialog } from './sign-out-dialog';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));
vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({ auth: { signOut: mocks.signOut } }),
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
  }: {
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
  Dialog: ({
    trigger,
    open,
    title,
    children,
  }: {
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

function renderDialog() {
  return render(
    <SignOutDialog
      renderTrigger={(openDialog) => (
        <button onClick={openDialog} type="button">
          Keluar
        </button>
      )}
    />,
  );
}

describe('SignOutDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('confirms sign out before returning to the home page', async () => {
    mocks.signOut.mockResolvedValue({ error: null });
    renderDialog();

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
    renderDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Keluar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ya, keluar' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Kamu belum berhasil keluar. Coba lagi.',
    );
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Keluar dari akun?' })).toBeTruthy();
  });

  it('can be opened and closed by its parent', () => {
    const onOpenChange = vi.fn();
    render(<SignOutDialog isOpen onOpenChange={onOpenChange} />);

    expect(screen.getByRole('dialog', { name: 'Keluar dari akun?' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
