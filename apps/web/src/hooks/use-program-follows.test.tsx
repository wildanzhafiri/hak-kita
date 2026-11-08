import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { useProgramFollows } from './use-program-follows';

const { authState, mockClient } = vi.hoisted(() => ({
  authState: { user: { id: 'user-1' } as { id: string } | null, isReady: true, isConfigured: true },
  mockClient: { from: vi.fn() },
}));

vi.mock('./use-auth', () => ({ useAuth: () => authState }));
vi.mock('@/lib/supabase/client', () => ({ getSupabaseBrowserClient: () => mockClient }));

const PROGRAM = makeProgram();

function mockQuery(rows: unknown[] = []) {
  const read = { eq: vi.fn(), order: vi.fn().mockResolvedValue({ data: rows, error: null }) };
  read.eq.mockReturnValue(read);
  const insertResult = { single: vi.fn().mockResolvedValue({ data: null, error: null }) };
  const insertQuery = { select: vi.fn().mockReturnValue(insertResult) };
  const updateQuery = { eq: vi.fn() };
  updateQuery.eq.mockReturnValueOnce(updateQuery).mockResolvedValueOnce({ error: null });
  const deleteQuery = { eq: vi.fn() };
  deleteQuery.eq.mockReturnValueOnce(deleteQuery).mockResolvedValueOnce({ error: null });
  const table = {
    select: vi.fn().mockReturnValue(read),
    insert: vi.fn().mockReturnValue(insertQuery),
    update: vi.fn().mockReturnValue(updateQuery),
    delete: vi.fn().mockReturnValue(deleteQuery),
  };
  mockClient.from.mockReturnValue(table);
  return { read, table, insertResult };
}

describe('useProgramFollows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: 'user-1' };
  });

  it('loads only the signed-in user follow rows', async () => {
    const { read } = mockQuery();
    const { result } = renderHook(() => useProgramFollows());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(read.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(result.current.rows).toEqual([]);
  });

  it('keeps the user informed if follows cannot be loaded', async () => {
    const { read } = mockQuery();
    read.order.mockResolvedValue({ data: null, error: { code: 'PGRST000' } });
    const { result } = renderHook(() => useProgramFollows());
    await waitFor(() => expect(result.current.error).toMatch(/belum dapat dimuat/));
    expect(result.current.rows).toEqual([]);
  });

  it('stores the current program snapshot when following', async () => {
    const { table, insertResult } = mockQuery();
    insertResult.single.mockResolvedValue({
      data: {
        user_id: 'user-1',
        program_id: PROGRAM.id,
        snapshot: {},
        created_at: '2026-11-06T00:00:00Z',
        updated_at: '2026-11-06T00:00:00Z',
      },
      error: null,
    });
    const { result } = renderHook(() => useProgramFollows());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => result.current.follow(PROGRAM));
    expect(table.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        program_id: PROGRAM.id,
        snapshot: expect.objectContaining({ syarat: ['Syarat contoh'] }),
      }),
    );
    expect(result.current.rows).toHaveLength(1);
  });
});
