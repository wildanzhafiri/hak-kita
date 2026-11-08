import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { FollowProgramButton } from './follow-program-button';

const followState = vi.hoisted(() => ({
  rows: [] as { program_id: string }[],
  isLoading: false,
  busyProgramId: null as string | null,
  error: null as string | null,
  isSignedIn: false,
  isConfigured: true,
  follow: vi.fn(),
  unfollow: vi.fn(),
  retry: vi.fn(),
}));

vi.mock('next/navigation', () => ({ usePathname: () => '/program/kip-kuliah' }));
vi.mock('@/hooks/use-program-follows', () => ({ useProgramFollows: () => followState }));

const PROGRAM = makeProgram({ id: 'kip-kuliah', nama: 'KIP Kuliah' });

describe('FollowProgramButton', () => {
  beforeEach(() => {
    followState.rows = [];
    followState.isSignedIn = false;
    followState.follow.mockClear();
    followState.unfollow.mockClear();
  });

  it('asks the visitor to sign in before following', () => {
    render(<FollowProgramButton program={PROGRAM} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ikuti program' }));
    expect(screen.getByRole('dialog', { name: 'Masuk untuk mengikuti program' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Masuk' }).getAttribute('href')).toContain('next=');
    expect(followState.follow).not.toHaveBeenCalled();
  });

  it('follows a program when signed in', () => {
    followState.isSignedIn = true;
    render(<FollowProgramButton program={PROGRAM} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ikuti program' }));
    expect(followState.follow).toHaveBeenCalledWith(PROGRAM);
  });

  it('allows a follower to stop following', () => {
    followState.isSignedIn = true;
    followState.rows = [{ program_id: PROGRAM.id }];
    render(<FollowProgramButton program={PROGRAM} />);
    fireEvent.click(screen.getByRole('button', { name: 'Berhenti mengikuti' }));
    expect(followState.unfollow).toHaveBeenCalledWith(PROGRAM.id);
  });
});
