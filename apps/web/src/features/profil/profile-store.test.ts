import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import { clearUserPreferences, loadUserProfile, saveUserProfile } from './profile-store';

const mocks = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
  upsert: vi.fn(),
  client: null as unknown,
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => mocks.client,
}));

const saved = {
  provinsi: '32',
  kota: '3273',
  kegiatan: ['pelajar'],
  kegiatanLain: '',
  pendidikan: 'sma',
  minat: ['Pendidikan'],
};

function createClient() {
  return {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }),
      upsert: mocks.upsert,
    }),
  };
}

describe('profile store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.client = createClient();
  });

  it('loads the saved name and preferences', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { display_name: 'Budi', preferences: saved },
      error: null,
    });

    expect(await loadUserProfile('user-1')).toEqual({
      nama: 'Budi',
      preferensi: saved,
      error: null,
    });
  });

  it('treats a new account without a row as an empty profile', async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: null });

    expect(await loadUserProfile('user-1')).toEqual({
      nama: '',
      preferensi: EMPTY_PREFERENCES,
      error: null,
    });
  });

  it('falls back to empty preferences when the saved ones are cleared or damaged', async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { display_name: 'Budi', preferences: {} },
      error: null,
    });

    expect(await loadUserProfile('user-1')).toEqual({
      nama: 'Budi',
      preferensi: EMPTY_PREFERENCES,
      error: null,
    });
  });

  it('reports a load failure instead of showing an empty profile as if it were saved', async () => {
    mocks.maybeSingle.mockResolvedValue({ data: null, error: { message: 'down' } });

    const result = await loadUserProfile('user-1');

    expect(result.error).toBe('Profil belum dapat dimuat. Muat ulang halaman lalu coba lagi.');
  });

  it('saves the name and preferences for the signed-in user only', async () => {
    mocks.upsert.mockResolvedValue({ error: null });

    expect(await saveUserProfile('user-1', 'Budi', saved as never)).toBeNull();

    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', display_name: 'Budi', preferences: saved }),
      { onConflict: 'user_id' },
    );
  });

  it('returns a message when saving fails or the client is missing', async () => {
    mocks.upsert.mockResolvedValue({ error: { message: 'denied' } });
    expect(await saveUserProfile('user-1', 'Budi', saved as never)).toBe(
      'Perubahan belum berhasil disimpan. Coba lagi.',
    );

    mocks.client = null;
    expect(await saveUserProfile('user-1', 'Budi', saved as never)).toBe(
      'Perubahan belum berhasil disimpan. Coba lagi.',
    );
  });

  it('clears the preferences but keeps the name', async () => {
    mocks.upsert.mockResolvedValue({ error: null });

    expect(await clearUserPreferences('user-1', 'Budi')).toBeNull();

    expect(mocks.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', display_name: 'Budi', preferences: {} }),
      { onConflict: 'user_id' },
    );
  });
});
