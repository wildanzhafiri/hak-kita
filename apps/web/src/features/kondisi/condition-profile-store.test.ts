import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Profile } from '@hakkita/schema';

const mockClient = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => mockClient,
}));

import {
  deleteAccountConditionProfile,
  loadAccountConditionProfile,
  saveAccountConditionProfile,
} from './condition-profile-store';

const PROFILE: Profile = {
  kelompok: 'calon-mahasiswa',
  rentangUsia: '18-24',
  wilayah: '31',
  tahunLulus: 2026,
};

function createQuery(result: { data?: { profile: unknown }; error?: Error | null }) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue({ data: result.data ?? null, error: result.error ?? null });
  query.upsert.mockResolvedValue({ error: result.error ?? null });
  query.delete.mockReturnValue(query);
  return query;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('condition profile persistence', () => {
  it('loads only a profile that matches the shared schema', async () => {
    const query = createQuery({ data: { profile: PROFILE } });
    mockClient.from.mockReturnValue(query);

    await expect(loadAccountConditionProfile('profile-user')).resolves.toEqual({
      profile: PROFILE,
      error: null,
    });
    expect(query.eq).toHaveBeenCalledWith('user_id', 'profile-user');
  });

  it('rejects account data that does not match the profile schema', async () => {
    const query = createQuery({
      data: {
        profile: { kelompok: 'lain', rentangUsia: null, wilayah: null, tahunLulus: null },
      },
    });
    mockClient.from.mockReturnValue(query);

    const result = await loadAccountConditionProfile('profile-invalid-user');

    expect(result.profile).toBeNull();
    expect(result.error).toBeTruthy();
  });

  it('saves the opted-in profile under the authenticated user id', async () => {
    const query = createQuery({});
    mockClient.from.mockReturnValue(query);

    await expect(saveAccountConditionProfile('profile-save-user', PROFILE)).resolves.toBeNull();
    expect(query.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'profile-save-user', profile: PROFILE }),
      { onConflict: 'user_id' },
    );
  });

  it('deletes the profile using the authenticated user id', async () => {
    const query = createQuery({});
    mockClient.from.mockReturnValue(query);

    await expect(deleteAccountConditionProfile('profile-delete-user')).resolves.toBeNull();
    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith('user_id', 'profile-delete-user');
  });
});
