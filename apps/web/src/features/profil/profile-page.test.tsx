import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { PreferensiProfil, Wilayah } from '@hakkita/schema';
import { ProfilePage } from './profile-page';

const mocks = vi.hoisted(() => ({
  clearPreferences: vi.fn(),
  auth: { user: { id: 'user-1', email: 'budi@contoh.id' } as unknown, isReady: true },
  profile: {
    status: 'ready' as 'ready' | 'loading' | 'error',
    nama: '',
    preferensi: null as unknown,
  },
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));
vi.mock('@/hooks/use-auth', () => ({ useAuth: () => mocks.auth }));
vi.mock('./use-profile', () => ({
  useProfile: () => ({
    ...mocks.profile,
    save: vi.fn(),
    clearPreferences: mocks.clearPreferences,
  }),
}));

const wilayah: Wilayah[] = [
  { kode: 'ID', nama: 'Nasional', level: 'nasional', parent: null },
  { kode: '32', nama: 'Jawa Barat', level: 'provinsi', parent: 'ID' },
  { kode: '3273', nama: 'Kota Bandung', level: 'kabkota', parent: '32' },
];

const complete: PreferensiProfil = {
  provinsi: '32',
  kota: '3273',
  kegiatan: ['pelajar', 'lainnya'],
  kegiatanLain: 'Relawan',
  pendidikan: 'sma',
  minat: ['Pendidikan', 'Kesehatan'],
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.user = { id: 'user-1', email: 'budi@contoh.id' };
    mocks.auth.isReady = true;
    mocks.profile.status = 'ready';
    mocks.profile.nama = 'Budi Santoso';
    mocks.profile.preferensi = complete;
    mocks.clearPreferences.mockResolvedValue(null);
  });

  it('asks a guest to sign in', () => {
    mocks.auth.user = null;
    render(<ProfilePage isSaved={false} wilayah={wilayah} />);

    expect(screen.getByRole('link', { name: /Masuk atau daftar/ }).getAttribute('href')).toBe(
      '/masuk?next=%2Fprofil',
    );
  });

  it('shows the account identity and the saved preferences', () => {
    render(<ProfilePage isSaved={false} wilayah={wilayah} />);

    expect(screen.getByRole('heading', { name: 'Budi Santoso' })).toBeTruthy();
    expect(screen.getByText('budi@contoh.id')).toBeTruthy();
    expect(screen.getByText('Jawa Barat, Kota Bandung')).toBeTruthy();
    expect(screen.getByText('Pelajar, Lainnya')).toBeTruthy();
    expect(screen.getByText('Relawan')).toBeTruthy();
    expect(screen.getByText('SMA/SMK/sederajat')).toBeTruthy();
    expect(screen.getByText('Pendidikan, Kesehatan')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Ubah preferensi/ }).getAttribute('href')).toBe(
      '/profil/edit?dari=profil',
    );
  });

  it('falls back to the email when no name was saved', () => {
    mocks.profile.nama = '';
    render(<ProfilePage isSaved={false} wilayah={wilayah} />);

    expect(screen.getByRole('heading', { name: 'budi@contoh.id' })).toBeTruthy();
  });

  it('invites a new account to set preferences and hides the delete action', () => {
    mocks.profile.preferensi = EMPTY_PREFERENCES;
    render(<ProfilePage isSaved={false} wilayah={wilayah} />);

    expect(screen.getByText('Belum ada preferensi tersimpan')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Atur preferensi/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Hapus informasi profil/ })).toBeNull();
  });

  it('confirms that a save went through', () => {
    render(<ProfilePage isSaved wilayah={wilayah} />);

    expect(screen.getByRole('status').textContent).toBe('Preferensimu sudah disimpan.');
  });

  it('asks before clearing the preferences, then reports it', async () => {
    render(<ProfilePage isSaved={false} wilayah={wilayah} />);

    fireEvent.click(screen.getByRole('button', { name: /Hapus informasi profil/ }));
    expect(await screen.findByRole('dialog', { name: 'Hapus informasi profil?' })).toBeTruthy();
    expect(mocks.clearPreferences).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Hapus informasi' }));

    await waitFor(() => expect(mocks.clearPreferences).toHaveBeenCalledOnce());
    expect((await screen.findByRole('status')).textContent).toBe('Informasi profil sudah dihapus.');
  });

  it('keeps the dialog open with the error when clearing fails', async () => {
    mocks.clearPreferences.mockResolvedValue('Informasi profil belum berhasil dihapus. Coba lagi.');
    render(<ProfilePage isSaved={false} wilayah={wilayah} />);

    fireEvent.click(screen.getByRole('button', { name: /Hapus informasi profil/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Hapus informasi' }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Informasi profil belum berhasil dihapus. Coba lagi.',
    );
    expect(screen.getByRole('dialog', { name: 'Hapus informasi profil?' })).toBeTruthy();
  });
});
