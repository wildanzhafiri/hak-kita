import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResetPasswordForm } from './reset-password-form';

const mocks = vi.hoisted(() => ({
  updateUser: vi.fn(),
  auth: { user: null as { id: string } | null, isReady: true },
}));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => mocks.auth }));
vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({ auth: { updateUser: mocks.updateUser } }),
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.user = { id: 'u1' };
    mocks.auth.isReady = true;
    mocks.updateUser.mockResolvedValue({ error: null });
  });

  it('tells someone without a recovery session to ask for a new link', () => {
    mocks.auth.user = null;
    render(<ResetPasswordForm />);

    expect(screen.getByRole('alert').textContent).toContain('Tautan pemulihan tidak valid');
    expect(screen.getByRole('link', { name: 'Minta tautan baru' }).getAttribute('href')).toBe(
      '/lupa-kata-sandi',
    );
    expect(screen.queryByLabelText('Kata sandi baru')).toBeNull();
  });

  it('refuses an empty or short password', async () => {
    render(<ResetPasswordForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Simpan kata sandi' }));
    expect((await screen.findByRole('alert')).textContent).toContain('Masukkan kata sandi.');

    fireEvent.change(screen.getByLabelText('Kata sandi baru'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan kata sandi' }));
    expect((await screen.findByRole('alert')).textContent).toContain('minimal 8 karakter');
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it('saves the new password and offers to continue', async () => {
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText('Kata sandi baru'), {
      target: { value: 'sandibaru123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan kata sandi' }));

    await waitFor(() =>
      expect(mocks.updateUser).toHaveBeenCalledWith({ password: 'sandibaru123' }),
    );
    expect((await screen.findByRole('status')).textContent).toBe('Kata sandi sudah diperbarui.');
    expect(screen.getByRole('link', { name: 'Lanjutkan ke HAKKITA' })).toBeTruthy();
  });

  it('shows an error when the update fails', async () => {
    mocks.updateUser.mockResolvedValue({ error: { message: 'weak' } });
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText('Kata sandi baru'), {
      target: { value: 'sandibaru123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan kata sandi' }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Kata sandi belum dapat diperbarui.',
    );
  });
});
