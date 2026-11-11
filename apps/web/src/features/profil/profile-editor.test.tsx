import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { PreferensiProfil, Wilayah } from '@hakkita/schema';
import { ProfileEditor } from './profile-editor';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  save: vi.fn(),
  auth: { user: { id: 'user-1' } as { id: string } | null, isReady: true },
  profile: {
    status: 'ready' as 'ready' | 'loading' | 'error',
    nama: '',
    preferensi: null as unknown,
  },
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('@/hooks/use-auth', () => ({ useAuth: () => mocks.auth }));
vi.mock('./use-profile', () => ({
  useProfile: () => ({ ...mocks.profile, save: mocks.save, clearPreferences: vi.fn() }),
}));

const wilayah: Wilayah[] = [
  { kode: 'ID', nama: 'Nasional', level: 'nasional', parent: null },
  { kode: '32', nama: 'Jawa Barat', level: 'provinsi', parent: 'ID' },
  { kode: '3273', nama: 'Kota Bandung', level: 'kabkota', parent: '32' },
];

function setProfile(nama: string, preferensi: PreferensiProfil) {
  mocks.profile.nama = nama;
  mocks.profile.preferensi = preferensi;
}

describe('ProfileEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.user = { id: 'user-1' };
    mocks.auth.isReady = true;
    mocks.profile.status = 'ready';
    setProfile('', EMPTY_PREFERENCES);
    mocks.save.mockResolvedValue(null);
  });

  it('asks a guest to sign in and keeps the way back to the editor', () => {
    mocks.auth.user = null;
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);

    const link = screen.getByRole('link', { name: /Masuk atau daftar/ });
    expect(link.getAttribute('href')).toBe('/masuk?next=%2Fprofil%2Fedit');
  });

  it('waits for the saved profile instead of showing an empty form', () => {
    mocks.profile.status = 'loading';
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);

    expect(screen.getByText('Memuat profilmu…')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Simpan preferensi/ })).toBeNull();
  });

  it('says so when the profile cannot be loaded', () => {
    mocks.profile.status = 'error';
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);

    expect(screen.getByRole('alert').textContent).toContain('Profil belum dapat dimuat');
  });

  it('saves the chosen name, region, activities, level and interests', async () => {
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);

    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: ' Budi Santoso ' } });
    fireEvent.click(screen.getByRole('button', { name: /Provinsi/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'Jawa Barat' }));
    fireEvent.click(screen.getByRole('button', { name: /Kabupaten\/kota/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'Kota Bandung' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Pelajar' }));
    fireEvent.click(screen.getByRole('button', { name: /Jenjang pendidikan/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'SMA/SMK/sederajat' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Pendidikan' }));
    fireEvent.click(screen.getByRole('button', { name: /Simpan preferensi/ }));

    await waitFor(() => expect(mocks.save).toHaveBeenCalledOnce());
    expect(mocks.save).toHaveBeenCalledWith('Budi Santoso', {
      provinsi: '32',
      kota: '3273',
      kegiatan: ['pelajar'],
      kegiatanLain: '',
      pendidikan: 'sma',
      minat: ['Pendidikan'],
    });
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/profil?disimpan=1'));
  });

  it('only asks for the free-text activity while "Lainnya" is chosen', () => {
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);
    expect(screen.queryByLabelText('Kegiatan lainnya (opsional)')).toBeNull();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Lainnya' }));

    expect(screen.getByLabelText('Kegiatan lainnya (opsional)')).toBeTruthy();
  });

  it('does not allow an existing name to be emptied', async () => {
    setProfile('Budi', EMPTY_PREFERENCES);
    render(<ProfileEditor fromProfile wilayah={wilayah} />);

    fireEvent.change(screen.getByLabelText('Nama'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /Simpan preferensi/ }));

    expect((await screen.findAllByRole('alert'))[0]?.textContent).toBe('Nama tidak boleh kosong.');
    expect(mocks.save).not.toHaveBeenCalled();
  });

  it('keeps the form and shows the error when saving fails', async () => {
    mocks.save.mockResolvedValue('Perubahan belum berhasil disimpan. Coba lagi.');
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Pelajar' }));
    fireEvent.click(screen.getByRole('button', { name: /Simpan preferensi/ }));

    expect((await screen.findByRole('alert')).textContent).toBe(
      'Perubahan belum berhasil disimpan. Coba lagi.',
    );
    expect(mocks.push).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox', { name: 'Pelajar' })).toHaveProperty('checked', true);
  });

  it('offers to skip for a new profile and to cancel for an existing one', () => {
    const { unmount } = render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);
    expect(screen.getByRole('button', { name: 'Lewati untuk sekarang' })).toBeTruthy();
    unmount();

    setProfile('', { ...EMPTY_PREFERENCES, minat: ['Pendidikan'] });
    render(<ProfileEditor fromProfile={false} wilayah={wilayah} />);
    expect(screen.getByRole('button', { name: 'Batal' })).toBeTruthy();
  });

  it('asks before leaving with unsaved changes', async () => {
    render(<ProfileEditor fromProfile wilayah={wilayah} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Pelajar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));

    expect(await screen.findByRole('dialog', { name: 'Tinggalkan perubahan?' })).toBeTruthy();
    expect(mocks.push).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Tinggalkan' }));
    expect(mocks.push).toHaveBeenCalledWith('/profil');
  });
});
