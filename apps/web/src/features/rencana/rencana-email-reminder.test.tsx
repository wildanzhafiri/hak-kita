import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { RencanaEmailReminder } from './rencana-email-reminder';

const mocks = vi.hoisted(() => ({
  follow: vi.fn(),
  unfollow: vi.fn(),
  retryFollows: vi.fn(),
  setEnabled: vi.fn(),
  retryPreference: vi.fn(),
}));

vi.mock('@/hooks/use-program-follows', () => ({
  useProgramFollows: () => ({
    rows: [],
    isLoading: false,
    busyProgramId: null,
    error: null,
    isSignedIn: true,
    isConfigured: true,
    follow: mocks.follow,
    unfollow: mocks.unfollow,
    retry: mocks.retryFollows,
  }),
}));

vi.mock('@/hooks/use-email-notification-preference', () => ({
  useEmailNotificationPreference: () => ({
    enabled: false,
    isLoading: false,
    isSaving: false,
    error: null,
    setEnabled: mocks.setEnabled,
    retry: mocks.retryPreference,
  }),
}));

describe('RencanaEmailReminder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('subscribes to the selected program and enables email updates', () => {
    const program = makeProgram({ id: 'program-pilihan', nama: 'Program Pilihan' });
    render(<RencanaEmailReminder isEmailAvailable program={program} />);

    expect(screen.getByText('Pengingat belum diaktifkan.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Dapatkan pengingat email' }));

    expect(mocks.follow).toHaveBeenCalledWith(program);
    expect(mocks.setEnabled).toHaveBeenCalledWith(true);
  });

  it('explains when email delivery is not configured', () => {
    render(<RencanaEmailReminder isEmailAvailable={false} program={makeProgram()} />);

    expect(screen.getByText('Pengingat email belum tersedia saat ini.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dapatkan pengingat email' }).hasAttribute('disabled')).toBe(
      true,
    );
  });
});
