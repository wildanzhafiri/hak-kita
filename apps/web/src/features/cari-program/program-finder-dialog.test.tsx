import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { PreferensiProfil } from '@hakkita/schema';
import { makeProgram } from '@/test/fixtures';
import { ProgramFinderDialog } from './program-finder-dialog';

const mocks = vi.hoisted(() => ({
  user: null as { id: string } | null,
  preferensi: null as PreferensiProfil | null,
  fetch: vi.fn(),
}));

vi.mock('@/hooks/use-auth', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('@/features/profil/use-profile', () => ({
  useProfile: () => ({ preferensi: mocks.preferensi }),
}));
vi.mock('@/components/program/program-card', () => ({
  ProgramCard: ({
    program,
    children,
  }: {
    program: { nama: string };
    children: React.ReactNode;
  }) => (
    <article>
      <h3>{program.nama}</h3>
      {children}
    </article>
  ),
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
  }: {
    children: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
  }) => (
    <button disabled={isDisabled} onClick={onPress} type="button">
      {children}
    </button>
  ),
}));
vi.mock('@/components/ui/button-link', () => ({
  ButtonLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('@/components/ui/select-field', () => ({
  SelectField: ({
    label,
    value,
    options,
    isDisabled,
    onChange,
  }: {
    label: string;
    value: string | null;
    options: { value: string; label: string }[];
    isDisabled?: boolean;
    onChange: (value: string) => void;
  }) => (
    <label>
      {label}
      <select disabled={isDisabled} onChange={(e) => onChange(e.target.value)} value={value ?? ''}>
        <option value="" />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  ),
}));
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    open,
    title,
    children,
    onOpenChange,
  }: {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onOpenChange: (isOpen: boolean) => void;
  }) =>
    open ? (
      <div aria-label={title} role="dialog">
        <button onClick={() => onOpenChange(false)} type="button">
          Tutup dialog
        </button>
        {children}
      </div>
    ) : null,
}));

const REGIONS = {
  provinces: [{ kode: '31', nama: 'DKI Jakarta' }],
  citiesByProvince: { '31': [{ kode: '3171', nama: 'Jakarta Selatan' }] },
};

const PROGRAM = makeProgram({ id: 'kip-kuliah', nama: 'KIP Kuliah' });

function respond(body: unknown, ok = true) {
  return Promise.resolve({ ok, json: () => Promise.resolve(body) });
}

function route(url: string, init?: RequestInit) {
  if (url === '/api/wilayah') return respond(REGIONS);
  if (url === '/api/rekomendasi' && init?.method === 'POST') {
    return respond({ recommendations: [] });
  }
  return respond({}, false);
}

function openFinder() {
  render(<ProgramFinderDialog label="Cari program untukmu" />);
  fireEvent.click(screen.getByRole('button', { name: /Cari program untukmu/ }));
}

describe('ProgramFinderDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    mocks.user = null;
    mocks.preferensi = EMPTY_PREFERENCES;
    mocks.fetch.mockImplementation(route);
    vi.stubGlobal('fetch', mocks.fetch);
  });

  it('starts on the first question and will not move on without a category', () => {
    openFinder();

    expect(screen.getByRole('dialog', { name: 'Cari Program untukmu' })).toBeTruthy();
    expect(screen.getByText('Langkah 1 dari 4')).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: 'Program seperti apa yang sedang kamu cari?' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /Lanjutkan/ })).toHaveProperty('disabled', true);

    fireEvent.click(screen.getByLabelText('Pendidikan'));

    expect(screen.getByRole('button', { name: /Lanjutkan/ })).toHaveProperty('disabled', false);
  });

  it('walks through the four questions and can go back or skip', async () => {
    openFinder();
    fireEvent.click(screen.getByLabelText('Pendidikan'));
    fireEvent.click(screen.getByRole('button', { name: /Lanjutkan/ }));

    expect(screen.getByText('Langkah 2 dari 4')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Mahasiswa'));
    fireEvent.click(screen.getByRole('button', { name: /Lanjutkan/ }));

    expect(screen.getByText('Langkah 3 dari 4')).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByLabelText('Provinsi')).toHaveProperty('disabled', false),
    );
    fireEvent.change(screen.getByLabelText('Provinsi'), { target: { value: '31' } });
    expect(screen.getByLabelText('Kabupaten/kota')).toHaveProperty('disabled', false);
    fireEvent.click(screen.getByRole('button', { name: 'Lewati' }));

    expect(screen.getByText('Langkah 4 dari 4')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Lihat rekomendasi/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Kembali' }));

    expect(screen.getByText('Langkah 3 dari 4')).toBeTruthy();
  });

  it('sends the answers and lists the programs with the reasons they were chosen', async () => {
    mocks.fetch.mockImplementation((url: string, init?: RequestInit) =>
      url === '/api/rekomendasi' && init?.method === 'POST'
        ? respond({
            recommendations: [
              {
                program: PROGRAM,
                score: 5,
                reasons: ['Bidang Pendidikan sesuai dengan minat yang kamu pilih.'],
                checks: ['Periode yang tercatat belum dibuka.'],
                periodStatus: 'belum-dibuka',
              },
            ],
          })
        : route(url, init),
    );
    openFinder();
    fireEvent.click(screen.getByLabelText('Pendidikan'));
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: /Lanjutkan/ }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Lihat rekomendasi/ }));

    expect(
      await screen.findByRole('heading', { name: 'Program yang mungkin sesuai untukmu' }),
    ).toBeTruthy();
    expect(await screen.findByText('KIP Kuliah')).toBeTruthy();
    expect(screen.getByText('Mengapa ditampilkan')).toBeTruthy();
    expect(screen.getByText('Bidang Pendidikan sesuai dengan minat yang kamu pilih.')).toBeTruthy();
    expect(screen.getByText('Periode pendaftaran akan datang')).toBeTruthy();
    expect(screen.getByText(/Periode yang tercatat belum dibuka\./)).toBeTruthy();
    const post = mocks.fetch.mock.calls.find(([url]) => url === '/api/rekomendasi');
    expect(JSON.parse((post?.[1] as RequestInit).body as string).minat).toEqual(['Pendidikan']);
  });

  it('says plainly when nothing matches and offers the full catalogue', async () => {
    openFinder();
    fireEvent.click(screen.getByLabelText('Pendidikan'));
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: /Lanjutkan/ }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Lihat rekomendasi/ }));

    expect(await screen.findByText('Belum menemukan program yang sesuai')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Lihat semua program/ }).getAttribute('href')).toBe(
      '/kenali-hakmu',
    );
  });

  it('reports a failed lookup instead of an empty list', async () => {
    mocks.fetch.mockImplementation((url: string, init?: RequestInit) =>
      url === '/api/rekomendasi' ? respond({}, false) : route(url, init),
    );
    openFinder();
    fireEvent.click(screen.getByLabelText('Pendidikan'));
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: /Lanjutkan/ }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Lihat rekomendasi/ }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Rekomendasi belum dapat dimuat.',
    );
  });

  it('keeps a guest’s answers in this tab so reopening continues from them', () => {
    openFinder();
    fireEvent.click(screen.getByLabelText('Pendidikan'));
    fireEvent.click(screen.getByRole('button', { name: 'Tutup dialog' }));
    fireEvent.click(screen.getByRole('button', { name: /Cari program untukmu/ }));

    expect((screen.getByLabelText('Pendidikan') as HTMLInputElement).checked).toBe(true);
  });

  it('offers to reuse the saved profile and fills the answers from it', () => {
    mocks.user = { id: 'u1' };
    mocks.preferensi = { ...EMPTY_PREFERENCES, minat: ['Beasiswa'], kegiatan: ['mahasiswa'] };
    openFinder();

    expect(screen.getByRole('heading', { name: 'Gunakan informasi profilmu?' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Gunakan profil saya/ }));

    expect((screen.getByLabelText('Beasiswa') as HTMLInputElement).checked).toBe(true);
  });

  it('starts from a blank form when the saved profile is not wanted', () => {
    mocks.user = { id: 'u1' };
    mocks.preferensi = { ...EMPTY_PREFERENCES, minat: ['Beasiswa'], kegiatan: ['mahasiswa'] };
    openFinder();
    fireEvent.click(screen.getByRole('button', { name: 'Jawab dari awal' }));

    expect((screen.getByLabelText('Beasiswa') as HTMLInputElement).checked).toBe(false);
  });
});
