import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSavedProgramsSnapshot,
  loadSavedPrograms,
  retrySavedPrograms,
  toggleSavedProgram,
} from './saved-program-store';

const mockClient = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => mockClient,
}));

function createReadQuery() {
  const query = { select: vi.fn(), eq: vi.fn(), order: vi.fn() };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  mockClient.from.mockReturnValue(query);
  return query;
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe('saved program loading', () => {
  it('lets the user retry after the database returns an error', async () => {
    const userId = 'user-with-database-error';
    const query = createReadQuery();
    query.order
      .mockResolvedValueOnce({ data: null, error: { code: 'PGRST000' } })
      .mockResolvedValueOnce({ data: [{ program_id: 'kip-kuliah' }], error: null });

    await loadSavedPrograms(userId);
    expect(getSavedProgramsSnapshot(userId).error).toBe(
      'Simpanan akun belum dapat dimuat. Coba lagi.',
    );

    await retrySavedPrograms(userId);
    expect(getSavedProgramsSnapshot(userId)).toMatchObject({
      ids: ['kip-kuliah'],
      isLoading: false,
      error: null,
    });
    expect(query.order).toHaveBeenCalledTimes(2);
  });

  it('clears the loading state when the network request throws', async () => {
    const userId = 'user-with-network-error';
    const query = createReadQuery();
    query.order.mockRejectedValueOnce(new Error('Network unavailable'));

    await loadSavedPrograms(userId);

    expect(getSavedProgramsSnapshot(userId)).toMatchObject({
      isLoading: false,
      error: 'Simpanan akun belum dapat dimuat. Coba lagi.',
    });
  });

  it('restores the saved state when adding a program throws', async () => {
    const userId = 'user-with-save-error';
    const query = createReadQuery();
    query.order.mockResolvedValueOnce({ data: [], error: null });
    await loadSavedPrograms(userId);

    mockClient.from.mockReturnValue({
      insert: vi.fn().mockRejectedValue(new Error('Network unavailable')),
    });
    await toggleSavedProgram(userId, 'kip-kuliah');

    expect(getSavedProgramsSnapshot(userId)).toMatchObject({
      ids: [],
      isSaving: false,
      error: 'Perubahan simpanan belum berhasil. Coba lagi.',
    });
  });
});
