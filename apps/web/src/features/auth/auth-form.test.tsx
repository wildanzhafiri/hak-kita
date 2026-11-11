import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthForm } from './auth-form';

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signInWithOAuth: vi.fn(),
  isConfigured: true,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));
vi.mock('@/lib/supabase/client', () => ({
  isSupabaseConfigured: () => mocks.isConfigured,
  getSupabaseBrowserClient: () => ({
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signUp: mocks.signUp,
      signInWithOAuth: mocks.signInWithOAuth,
    },
  }),
}));

function renderForm(overrides: Partial<Parameters<typeof AuthForm>[0]> = {}) {
  return render(
    <AuthForm
      adminMode={false}
      initialMessage={null}
      mode="login"
      nextPath="/rencanaku"
      saveProgramId={null}
      {...overrides}
    />,
  );
}

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isConfigured = true;
    mocks.signInWithPassword.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    mocks.signUp.mockResolvedValue({ data: { user: { id: 'u1' }, session: null }, error: null });
  });

  it('shows the sign-in layout with Google, email, password, forgot link and guest link', () => {
    renderForm();

    expect(screen.getByRole('button', { name: /Lanjutkan dengan Google/ })).toBeTruthy();
    expect(screen.getByText('atau masuk dengan email')).toBeTruthy();
    expect(screen.getByLabelText('Alamat email')).toBeTruthy();
    expect(screen.getByLabelText('Kata sandi')).toBeTruthy();
    expect(screen.queryByLabelText('Nama Lengkap')).toBeNull();
    expect(screen.getByRole('link', { name: 'Lupa kata sandi?' }).getAttribute('href')).toBe(
      '/lupa-kata-sandi',
    );
    expect(screen.getByRole('link', { name: 'Daftar' }).getAttribute('href')).toBe('/daftar');
    expect(screen.getByRole('link', { name: 'Lanjut tanpa akun' }).getAttribute('href')).toBe(
      '/kenali-hakmu',
    );
    expect(screen.queryByText(/admin/i)).toBeNull();
  });

  it('asks for a name too on the sign-up form and drops the forgot link', () => {
    renderForm({ mode: 'signup', nextPath: '/selamat-datang' });

    expect(screen.getByLabelText('Nama Lengkap')).toBeTruthy();
    expect(screen.getByText('atau daftar dengan email')).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Lupa kata sandi?' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Buat akun' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Masuk' }).getAttribute('href')).toBe('/masuk');
  });

  it('keeps a page the guest came from as the guest destination', () => {
    renderForm({ nextPath: '/kenali-hakmu/kip-kuliah' });

    expect(screen.getByRole('link', { name: 'Lanjut tanpa akun' }).getAttribute('href')).toBe(
      '/kenali-hakmu/kip-kuliah',
    );
  });

  it('lists what is missing and does not call the server', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Masukkan alamat email.');
    expect(alert.textContent).toContain('Masukkan kata sandi.');
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it('signs in with a trimmed email and goes to the page asked for', async () => {
    renderForm({ nextPath: '/rencanaku/tersimpan' });

    fill('Alamat email', ' budi@contoh.id ');
    fill('Kata sandi', 'rahasia123');
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() =>
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'budi@contoh.id',
        password: 'rahasia123',
      }),
    );
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/rencanaku/tersimpan'));
  });

  it('shows a clear message for a wrong password and clears the field', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });
    renderForm();

    fill('Alamat email', 'budi@contoh.id');
    fill('Kata sandi', 'salah');
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Email atau kata sandi belum cocok.',
    );
    expect(screen.getByLabelText('Kata sandi')).toHaveProperty('value', '');
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('registers with the name, then asks to confirm the email when no session starts', async () => {
    renderForm({ mode: 'signup', nextPath: '/selamat-datang' });

    fill('Nama Lengkap', ' Budi Santoso ');
    fill('Alamat email', 'budi@contoh.id');
    fill('Kata sandi', 'rahasia123');
    fireEvent.click(screen.getByRole('button', { name: 'Buat akun' }));

    await waitFor(() => expect(mocks.signUp).toHaveBeenCalledOnce());
    const request = mocks.signUp.mock.calls[0]?.[0];
    expect(request.options.data).toEqual({ nama: 'Budi Santoso' });
    expect(request.options.emailRedirectTo).toContain('/auth/callback?next=%2Fselamat-datang');
    expect((await screen.findByRole('status')).textContent).toBe(
      'Periksa emailmu untuk mengonfirmasi pendaftaran sebelum masuk.',
    );
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('refuses a short password when registering', async () => {
    renderForm({ mode: 'signup' });

    fill('Nama Lengkap', 'Budi');
    fill('Alamat email', 'budi@contoh.id');
    fill('Kata sandi', '123');
    fireEvent.click(screen.getByRole('button', { name: 'Buat akun' }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Gunakan kata sandi minimal 8 karakter.',
    );
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it('shows and hides the password', () => {
    renderForm();
    const field = screen.getByLabelText('Kata sandi');
    expect(field.getAttribute('type')).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: 'Tampilkan kata sandi' }));
    expect(field.getAttribute('type')).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: 'Sembunyikan kata sandi' }));
    expect(field.getAttribute('type')).toBe('password');
  });

  it('starts Google sign-in and returns to the same page', async () => {
    mocks.signInWithOAuth.mockResolvedValue({ error: null });
    renderForm({ nextPath: '/rencanaku' });

    fireEvent.click(screen.getByRole('button', { name: /Lanjutkan dengan Google/ }));

    await waitFor(() => expect(mocks.signInWithOAuth).toHaveBeenCalledOnce());
    expect(mocks.signInWithOAuth.mock.calls[0]?.[0].options.redirectTo).toContain(
      '/auth/callback?next=%2Frencanaku',
    );
  });

  it('says accounts are unavailable and disables the form when Supabase is not set up', () => {
    mocks.isConfigured = false;
    renderForm();

    expect(screen.getByRole('status').textContent).toContain(
      'Masuk dengan Google dan email belum tersedia.',
    );
    expect(screen.getByLabelText('Alamat email')).toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Masuk' })).toHaveProperty('disabled', true);
  });

  it('hides the public extras in admin mode', () => {
    renderForm({ adminMode: true, nextPath: '/admin/validasi' });

    expect(screen.queryByRole('button', { name: /Google/ })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Lupa kata sandi?' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Lanjut tanpa akun' })).toBeNull();
  });
});
