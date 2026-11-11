import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import { ProfileProvider } from './profile-provider';
import { useProfile } from './use-profile';

const mocks = vi.hoisted(() => ({
  user: null as { id: string; user_metadata: Record<string, unknown> } | null,
  load: vi.fn(),
}));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('./profile-store', () => ({
  loadUserProfile: mocks.load,
  saveUserProfile: vi.fn(),
  clearUserPreferences: vi.fn(),
}));

function Reader() {
  const { status, nama } = useProfile();
  return (
    <p>
      {status}|{nama}
    </p>
  );
}

describe('ProfileProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stays idle for a guest and never loads anything', () => {
    mocks.user = null;
    render(
      <ProfileProvider>
        <Reader />
      </ProfileProvider>,
    );

    expect(screen.getByText('idle|')).toBeTruthy();
    expect(mocks.load).not.toHaveBeenCalled();
  });

  it('uses the name given at sign-up until a name is saved on the profile', async () => {
    mocks.user = { id: 'u1', user_metadata: { nama: 'Budi Santoso' } };
    mocks.load.mockResolvedValue({ nama: '', preferensi: EMPTY_PREFERENCES, error: null });
    render(
      <ProfileProvider>
        <Reader />
      </ProfileProvider>,
    );

    await waitFor(() => expect(screen.getByText('ready|Budi Santoso')).toBeTruthy());
  });

  it('prefers the saved name over the one from sign-up', async () => {
    mocks.user = { id: 'u1', user_metadata: { nama: 'Budi Santoso' } };
    mocks.load.mockResolvedValue({ nama: 'Budi S', preferensi: EMPTY_PREFERENCES, error: null });
    render(
      <ProfileProvider>
        <Reader />
      </ProfileProvider>,
    );

    await waitFor(() => expect(screen.getByText('ready|Budi S')).toBeTruthy());
  });
});
