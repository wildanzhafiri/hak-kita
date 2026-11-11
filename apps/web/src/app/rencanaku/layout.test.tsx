import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RencanakuLayout from './layout';

const mocks = vi.hoisted(() => ({
  user: null as { id: string; email: string } | null,
  loadPublishedInformation: vi.fn(),
  loadWilayahFile: vi.fn(),
}));

vi.mock('@/server/current-user', () => ({ getCurrentUser: async () => mocks.user }));
vi.mock('@/server/data', () => ({
  loadPublishedInformation: mocks.loadPublishedInformation,
  loadWilayahFile: mocks.loadWilayahFile,
}));
vi.mock('@/features/rencana/rencana-provider', () => ({
  RencanaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/features/rencana/rencana-shell', () => ({
  RencanaShell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RencanakuLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.user = null;
    mocks.loadPublishedInformation.mockResolvedValue([]);
    mocks.loadWilayahFile.mockResolvedValue({ wilayah: [] });
  });

  it('shows the sign-in gate to a guest and never renders the plan or loads its data', async () => {
    render(await RencanakuLayout({ children: <p>Isi rencana</p> }));

    expect(screen.getByText('Masuk untuk melihat Rencanaku')).toBeTruthy();
    expect(screen.queryByText('Isi rencana')).toBeNull();
    expect(mocks.loadPublishedInformation).not.toHaveBeenCalled();
  });

  it('shows the plan to a signed-in person', async () => {
    mocks.user = { id: 'user-1', email: 'budi@contoh.id' };
    render(await RencanakuLayout({ children: <p>Isi rencana</p> }));

    expect(screen.getByText('Isi rencana')).toBeTruthy();
    expect(screen.queryByText('Masuk untuk melihat Rencanaku')).toBeNull();
  });
});
