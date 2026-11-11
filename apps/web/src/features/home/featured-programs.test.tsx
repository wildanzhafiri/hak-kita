import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { PreferensiProfil } from '@hakkita/schema';
import { makeProgram } from '@/test/fixtures';
import { FeaturedPrograms } from './featured-programs';

const mocks = vi.hoisted(() => ({
  auth: { user: null as { id: string } | null, isReady: true },
  profile: { status: 'idle' as string, preferensi: null as unknown },
}));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => mocks.auth }));
vi.mock('@/features/profil/use-profile', () => ({ useProfile: () => mocks.profile }));
vi.mock('@/components/program/program-grid', () => ({
  ProgramGrid: ({ programs }: { programs: { id: string; nama: string }[] }) => (
    <ul>
      {programs.map((program) => (
        <li key={program.id}>{program.nama}</li>
      ))}
    </ul>
  ),
}));

const general = [makeProgram({ id: 'umum', nama: 'Program Umum' })];
const personal = makeProgram({ id: 'pilihan', nama: 'Program Pilihan' });
const enough: PreferensiProfil = {
  ...EMPTY_PREFERENCES,
  minat: ['Pendidikan'],
  kegiatan: ['pelajar'],
};

function mockFetch(programs: unknown[], ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, json: async () => ({ programs }) });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('FeaturedPrograms', () => {
  beforeEach(() => {
    mocks.auth.user = null;
    mocks.auth.isReady = true;
    mocks.profile.status = 'idle';
    mocks.profile.preferensi = EMPTY_PREFERENCES;
  });

  afterEach(() => vi.unstubAllGlobals());

  it('shows the general programs and an invitation to sign up for a guest', () => {
    const fetchMock = mockFetch([]);
    render(<FeaturedPrograms programs={general} />);

    expect(screen.getByRole('heading', { name: 'Program Unggulan' })).toBeTruthy();
    expect(screen.getByText('Program Umum')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Buat akun dan lengkapi profilmu.' })).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('asks a signed-in person with a thin profile to complete it, without personal picks', () => {
    const fetchMock = mockFetch([]);
    mocks.auth.user = { id: 'user-1' };
    mocks.profile.status = 'ready';
    mocks.profile.preferensi = { ...EMPTY_PREFERENCES, provinsi: '32' };
    render(<FeaturedPrograms programs={general} />);

    expect(screen.getByRole('link', { name: 'Lengkapi profilmu.' }).getAttribute('href')).toBe(
      '/profil/edit',
    );
    expect(screen.getByText('Program Umum')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('swaps in the recommendations when the profile is enough', async () => {
    mockFetch([personal]);
    mocks.auth.user = { id: 'user-1' };
    mocks.profile.status = 'ready';
    mocks.profile.preferensi = enough;
    render(<FeaturedPrograms programs={general} />);

    expect(await screen.findByText('Program Pilihan')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Rekomendasi untukmu' })).toBeTruthy();
    expect(screen.queryByText('Program Umum')).toBeNull();
    expect(screen.getByRole('link', { name: 'Lihat rekomendasi.' }).getAttribute('href')).toBe(
      '/kenali-hakmu/rekomendasi',
    );
  });

  it('keeps the general programs when there are no recommendations or the request fails', async () => {
    const fetchMock = mockFetch([], false);
    mocks.auth.user = { id: 'user-1' };
    mocks.profile.status = 'ready';
    mocks.profile.preferensi = enough;
    render(<FeaturedPrograms programs={general} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(screen.getByRole('heading', { name: 'Program Unggulan' })).toBeTruthy();
    expect(screen.getByText('Program Umum')).toBeTruthy();
  });

  it('ignores recommendations that are not valid programs', async () => {
    const fetchMock = mockFetch([{ id: 'rusak' }]);
    mocks.auth.user = { id: 'user-1' };
    mocks.profile.status = 'ready';
    mocks.profile.preferensi = enough;
    render(<FeaturedPrograms programs={general} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(screen.getByText('Program Umum')).toBeTruthy();
  });

  it('keeps the original description until the account is known', () => {
    mocks.auth.isReady = false;
    render(<FeaturedPrograms programs={general} />);

    expect(
      screen.getByText('Jelajahi berbagai program bantuan dan kesempatan yang tersedia.'),
    ).toBeTruthy();
  });
});
