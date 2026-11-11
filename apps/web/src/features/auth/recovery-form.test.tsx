import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RecoveryForm } from './recovery-form';

const mocks = vi.hoisted(() => ({ resetPasswordForEmail: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  isSupabaseConfigured: () => true,
  getSupabaseBrowserClient: () => ({
    auth: { resetPasswordForEmail: mocks.resetPasswordForEmail },
  }),
}));

describe('RecoveryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it('validates the email before asking for a recovery link', async () => {
    render(<RecoveryForm />);

    fireEvent.change(screen.getByLabelText('Alamat email'), { target: { value: 'bukan-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kirim tautan pemulihan' }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Periksa kembali format alamat email.',
    );
    expect(mocks.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('sends the link back through the callback to the new-password page', async () => {
    render(<RecoveryForm />);

    fireEvent.change(screen.getByLabelText('Alamat email'), {
      target: { value: ' budi@contoh.id ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Kirim tautan pemulihan' }));

    await waitFor(() => expect(mocks.resetPasswordForEmail).toHaveBeenCalledOnce());
    expect(mocks.resetPasswordForEmail.mock.calls[0]?.[0]).toBe('budi@contoh.id');
    expect(mocks.resetPasswordForEmail.mock.calls[0]?.[1].redirectTo).toContain(
      '/auth/callback?next=%2Fatur-kata-sandi',
    );
  });

  it('answers the same way for any address so it does not reveal who has an account', async () => {
    render(<RecoveryForm />);

    fireEvent.change(screen.getByLabelText('Alamat email'), { target: { value: 'a@b.id' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kirim tautan pemulihan' }));

    expect((await screen.findByRole('status')).textContent).toBe(
      'Jika alamat email terdaftar, ikuti petunjuk pemulihan yang diberikan layanan autentikasi.',
    );
    expect(screen.getByRole('link', { name: 'Kembali ke Masuk' }).getAttribute('href')).toBe(
      '/masuk',
    );
  });

  it('reports a failure to send', async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: { message: 'smtp' } });
    render(<RecoveryForm />);

    fireEvent.change(screen.getByLabelText('Alamat email'), { target: { value: 'a@b.id' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kirim tautan pemulihan' }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Tautan pemulihan belum dapat dikirim.',
    );
  });
});
