import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockClient = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => mockClient,
}));

import {
  getBerkasProgressSnapshot,
  loadBerkasProgress,
  mergeCheckedItemIds,
  saveBerkasProgress,
} from './berkas-progress-store';

function createQuery(
  data: {
    answers: Record<string, string>;
    checked_item_ids: string[];
    details_updated_at: string | null;
    note: string;
  } | null,
) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    upsert: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue({ data, error: null });
  query.upsert.mockResolvedValue({ error: null });
  return query;
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe('berkas progress account sync', () => {
  it('deduplicates checked documents', () => {
    expect(mergeCheckedItemIds(['formulir', 'foto'], ['foto', 'kk'])).toEqual([
      'formulir',
      'foto',
      'kk',
    ]);
  });

  it('keeps newer account answers and note while merging local checks once', async () => {
    const userId = 'user-berkas-account';
    const programId = 'program-berkas-account';
    const query = createQuery({
      answers: { status: 'mahasiswa' },
      checked_item_ids: ['formulir'],
      details_updated_at: '2026-11-05T01:00:00.000Z',
      note: 'Catatan akun',
    });
    mockClient.from.mockReturnValue(query);
    window.localStorage.setItem(
      `hakkita:berkas:${programId}`,
      JSON.stringify({ answers: { status: 'siswa' }, checked: ['foto'], note: 'Catatan lama' }),
    );

    await loadBerkasProgress(userId, programId);

    expect(query.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: { status: 'mahasiswa' },
        checked_item_ids: ['formulir', 'foto'],
        note: 'Catatan akun',
      }),
      { onConflict: 'user_id,program_id' },
    );
    expect(getBerkasProgressSnapshot(userId, programId)).toMatchObject({
      answers: { status: 'mahasiswa' },
      checked: ['formulir', 'foto'],
      note: 'Catatan akun',
    });
    expect(window.localStorage.getItem(`hakkita:berkas:${programId}`)).toBeNull();
  });

  it('moves all local progress into a new account row', async () => {
    const programId = 'program-berkas-new';
    const query = createQuery(null);
    mockClient.from.mockReturnValue(query);
    window.localStorage.setItem(
      `hakkita:berkas:${programId}`,
      JSON.stringify({ answers: { status: 'siswa' }, checked: ['foto'], note: 'Tanya sekolah' }),
    );

    await loadBerkasProgress('user-berkas-new', programId);

    expect(query.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: { status: 'siswa' },
        checked_item_ids: ['foto'],
        note: 'Tanya sekolah',
      }),
      { onConflict: 'user_id,program_id' },
    );
    expect(window.localStorage.getItem(`hakkita:berkas:${programId}`)).toBeNull();
  });

  it('fills detail fields on an older check-only account row', async () => {
    const programId = 'program-berkas-legacy';
    const query = createQuery({
      answers: {},
      checked_item_ids: ['formulir'],
      details_updated_at: null,
      note: '',
    });
    mockClient.from.mockReturnValue(query);
    window.localStorage.setItem(
      `hakkita:berkas:${programId}`,
      JSON.stringify({ answers: { status: 'siswa' }, checked: ['foto'], note: 'Tanya sekolah' }),
    );

    await loadBerkasProgress('user-berkas-legacy', programId);

    expect(query.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        answers: { status: 'siswa' },
        checked_item_ids: ['formulir', 'foto'],
        note: 'Tanya sekolah',
        details_updated_at: expect.any(String),
      }),
      { onConflict: 'user_id,program_id' },
    );
  });

  it('does not upload a local note containing a NIK-like number', async () => {
    const programId = 'program-berkas-private';
    const query = createQuery(null);
    mockClient.from.mockReturnValue(query);
    window.localStorage.setItem(
      `hakkita:berkas:${programId}`,
      JSON.stringify({ answers: {}, checked: [], note: 'Nomor 1234567890123456' }),
    );

    await loadBerkasProgress('user-berkas-private', programId);

    expect(query.upsert).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(`hakkita:berkas:${programId}`)).not.toBeNull();
    expect(getBerkasProgressSnapshot('user-berkas-private', programId).error).toContain('16 digit');
  });

  it('blocks writes when the account could not be loaded', async () => {
    const userId = 'user-berkas-load-error';
    const programId = 'program-berkas-load-error';
    const query = createQuery(null);
    query.maybeSingle.mockResolvedValue({ data: null, error: { message: 'table unavailable' } });
    mockClient.from.mockReturnValue(query);

    await loadBerkasProgress(userId, programId);
    saveBerkasProgress(userId, programId, { answers: {}, checked: ['foto'], note: '' });

    expect(getBerkasProgressSnapshot(userId, programId)).toMatchObject({
      isLoading: true,
      error: 'Progres berkas akun belum dapat dimuat. Coba muat ulang halaman.',
    });
    expect(query.upsert).not.toHaveBeenCalled();
  });

  it('queues rapid note changes and retains the latest value', async () => {
    const userId = 'user-berkas-rapid';
    const programId = 'program-berkas-rapid';
    const query = createQuery(null);
    mockClient.from.mockReturnValue(query);
    await loadBerkasProgress(userId, programId);

    saveBerkasProgress(userId, programId, { answers: {}, checked: [], note: 'Tanya' });
    saveBerkasProgress(userId, programId, { answers: {}, checked: [], note: 'Tanya sekolah' });
    await vi.waitFor(() => expect(query.upsert).toHaveBeenCalledTimes(2));
    await vi.waitFor(() =>
      expect(getBerkasProgressSnapshot(userId, programId).isSaving).toBe(false),
    );

    expect(query.upsert).toHaveBeenLastCalledWith(
      expect.objectContaining({ note: 'Tanya sekolah' }),
      { onConflict: 'user_id,program_id' },
    );
    expect(getBerkasProgressSnapshot(userId, programId).note).toBe('Tanya sekolah');
  });

  it('reloads account progress after another device changes it', async () => {
    const userId = 'user-berkas-reload';
    const programId = 'program-berkas-reload';
    const query = createQuery({
      answers: { status: 'siswa' },
      checked_item_ids: ['foto'],
      details_updated_at: '2026-11-05T01:00:00.000Z',
      note: 'Catatan pertama',
    });
    mockClient.from.mockReturnValue(query);
    await loadBerkasProgress(userId, programId);
    query.maybeSingle.mockResolvedValue({
      data: {
        answers: { status: 'mahasiswa' },
        checked_item_ids: ['foto', 'kk'],
        details_updated_at: '2026-11-05T02:00:00.000Z',
        note: 'Catatan terbaru',
      },
      error: null,
    });

    await loadBerkasProgress(userId, programId);

    expect(query.maybeSingle).toHaveBeenCalledTimes(2);
    expect(getBerkasProgressSnapshot(userId, programId)).toMatchObject({
      answers: { status: 'mahasiswa' },
      checked: ['foto', 'kk'],
      note: 'Catatan terbaru',
    });
  });
});
