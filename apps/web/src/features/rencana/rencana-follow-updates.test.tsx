import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProgramFollowSnapshot } from '@hakkita/domain';
import type { ProgramFollowSnapshot } from '@hakkita/domain';
import { makeProgram } from '@/test/fixtures';
import { RencanaFollowUpdates } from './rencana-follow-updates';

const followState = vi.hoisted(() => ({
  rows: [] as {
    user_id: string;
    program_id: string;
    snapshot: ProgramFollowSnapshot;
    created_at: string;
    updated_at: string;
  }[],
  isLoading: false,
  busyProgramId: null as string | null,
  error: null as string | null,
  isSignedIn: true,
  unfollow: vi.fn(),
  markSeen: vi.fn(),
  retry: vi.fn(),
}));

vi.mock('@/hooks/use-program-follows', () => ({ useProgramFollows: () => followState }));
vi.mock('./rencana-context', () => ({ useRencanaState: () => ({ today: '2026-11-06' }) }));

describe('RencanaFollowUpdates', () => {
  beforeEach(() => {
    followState.rows = [];
    followState.error = null;
    followState.isSignedIn = true;
    followState.markSeen.mockClear();
  });

  it('shows a sourced update and lets the user acknowledge it', () => {
    const previous = makeProgram();
    const current = makeProgram({ syarat: [{ teks: 'Syarat baru' }] });
    followState.rows = [
      {
        user_id: 'user-1',
        program_id: current.id,
        snapshot: createProgramFollowSnapshot(previous, '2026-11-01'),
        created_at: '2026-11-01T00:00:00Z',
        updated_at: '2026-11-01T00:00:00Z',
      },
    ];
    render(<RencanaFollowUpdates programs={[current]} isEmailAvailable={false} />);
    expect(screen.getByText('Persyaratan berubah')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Periksa sumber resmi' }).getAttribute('href')).toBe(
      current.sumberUtama.url,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Tandai sudah dibaca' }));
    expect(followState.markSeen).toHaveBeenCalledWith(current);
  });

  it('shows an empty state without inventing updates', () => {
    render(<RencanaFollowUpdates programs={[]} isEmailAvailable={false} />);
    expect(screen.getByText(/Belum ada program yang kamu ikuti/)).toBeTruthy();
    expect(screen.queryByText('Baru')).toBeNull();
  });
});
