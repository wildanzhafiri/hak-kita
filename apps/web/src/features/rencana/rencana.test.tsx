import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { serializeBerkasProgress } from '@hakkita/domain';
import {
  BERKAS_STORAGE_PREFIX,
  SAVED_STORAGE_KEY,
  STEP_PROGRESS_STORAGE_PREFIX,
} from '@/config/storage';
import { BERKAS, BUILT_ON, WILAYAH, makeProgram } from '@/test/fixtures';
import { DeviceDataPanel } from './device-data-panel';
import { RencanaBerkas } from './rencana-berkas';
import { RencanaDeadlines } from './rencana-deadlines';
import { RencanaProvider } from './rencana-provider';
import { RencanaSaved } from './rencana-saved';
import { RencanaShell } from './rencana-shell';
import { RencanaSummary } from './rencana-summary';

const savedIdsState = vi.hoisted(() => ({ isLoading: false }));

vi.mock('next/navigation', () => ({ usePathname: () => '/rencanaku/berkas' }));
vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: null, isReady: true, isConfigured: true }),
}));
vi.mock('@/hooks/use-saved-ids', async () => {
  const React = await import('react');
  const { SAVED_STORAGE_KEY } = await import('@/config/storage');
  const listeners = new Set<() => void>();
  let lastValue: string | null = null;
  let lastIds: string[] = [];

  function readIds() {
    const saved = window.localStorage.getItem(SAVED_STORAGE_KEY);
    if (saved !== lastValue) {
      lastValue = saved;
      lastIds = saved ? (JSON.parse(saved) as string[]) : [];
    }
    return lastIds;
  }

  function writeIds(ids: string[]) {
    lastValue = JSON.stringify(ids);
    lastIds = ids;
    window.localStorage.setItem(SAVED_STORAGE_KEY, lastValue);
    listeners.forEach((listener) => listener());
  }

  return {
    useSavedIds() {
      const ids = React.useSyncExternalStore(
        (listener) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        readIds,
        readIds,
      );
      const toggle = async (id: string) => {
        const nextIds = ids.includes(id) ? ids.filter((savedId) => savedId !== id) : [...ids, id];
        writeIds(nextIds);
      };
      const clear = async () => {
        writeIds([]);
      };
      return {
        ids,
        toggle,
        clear,
        isLoading: savedIdsState.isLoading,
        isSaving: false,
        error: null,
      };
    },
  };
});

const PROGRAMS = [
  makeProgram({
    id: 'kip-kuliah',
    nama: 'KIP Kuliah',
    berkas: BERKAS,
    periode: { buka: '2026-02-03', tutup: '2026-11-05' },
  }),
  makeProgram({ id: 'pkh', nama: 'PKH' }),
  makeProgram({
    id: 'ktp-el',
    nama: 'Pengurusan KTP-el',
    jenis: 'layanan',
    kategori: 'Kependudukan & Dokumen Pribadi',
  }),
];

function renderInRencana(ui: ReactNode) {
  return render(
    <RencanaProvider programs={PROGRAMS} wilayah={WILAYAH} builtOn={BUILT_ON}>
      {ui}
    </RencanaProvider>,
  );
}

function saveBerkas(answers: Record<string, string>, checked: string[], note = '') {
  window.localStorage.setItem(
    `${BERKAS_STORAGE_PREFIX}kip-kuliah`,
    serializeBerkasProgress({ answers, checked, note }),
  );
}

function saveProgramIds(ids: string[]) {
  window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
}

beforeEach(() => {
  savedIdsState.isLoading = false;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-30T05:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('RencanaSummary', () => {
  it('resumes a guide started without saving a program to an account', () => {
    window.localStorage.setItem(
      `${STEP_PROGRESS_STORAGE_PREFIX}pkh`,
      '{"completed":[],"stuck":null}',
    );
    renderInRencana(<RencanaSummary />);
    expect(screen.getByRole('heading', { name: 'Lanjutkan panduan PKH.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Lihat panduan/ }).getAttribute('href')).toBe(
      '#panduan-langkah',
    );
  });

  it('keeps self-marked progress and shows sourced help for a stuck step', async () => {
    saveProgramIds(['kip-kuliah']);
    renderInRencana(<RencanaSummary />);
    expect(screen.getByRole('heading', { name: 'Panduan langkahmu' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tandai selesai langkah 1 KIP Kuliah' }));
    expect(window.localStorage.getItem(`${STEP_PROGRESS_STORAGE_PREFIX}kip-kuliah`)).toContain(
      '"completed":[0]',
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Saya terkendala pada langkah 2 KIP Kuliah' }),
    );
    fireEvent.click(screen.getByRole('button', { name: /Pilih kendala berkas/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'NISN tidak dikenali' }));
    expect(screen.getByText('Minta operator sekolah memperbaiki data.')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Lihat sumber/ }).getAttribute('href')).toBe(
      'https://contoh.go.id/panduan',
    );
    expect(screen.getByText(/bukan status pengajuan di kanal pemerintah/)).toBeTruthy();
  });

  it('invites the visitor to explore when nothing has been saved or started', () => {
    renderInRencana(<RencanaSummary />);
    expect(screen.getByRole('heading', { name: 'Mulai dari satu program.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Jelajahi program/ }).getAttribute('href')).toBe(
      '/kenali-hakmu',
    );
  });

  it('puts the unfinished berkas first, with the days left before it closes', () => {
    saveBerkas({ ekonomi: 'kip' }, []);
    renderInRencana(<RencanaSummary />);
    expect(
      screen.getByRole('heading', { name: 'Tinggal 1 dokumen untuk KIP Kuliah.' }),
    ).toBeTruthy();
    expect(screen.getByText('Dibuka sampai 5 November 2026 (6 hari lagi)')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Lanjutkan berkas/ }).getAttribute('href')).toBe(
      '/kenali-hakmu/kip-kuliah/berkas',
    );
  });

  it('states that the percentage counts self-checked documents, not an official status', () => {
    saveBerkas({ ekonomi: 'kip' }, []);
    renderInRencana(<RencanaSummary />);
    expect(screen.getByText(/bukan status pengajuan di sistem pemerintah/)).toBeTruthy();
  });

  it('sends the visitor to the official site once every document is ready', () => {
    saveBerkas({ ekonomi: 'kip' }, ['email']);
    renderInRencana(<RencanaSummary />);
    expect(
      screen.getByRole('heading', { name: 'Semua dokumen KIP Kuliah sudah siap.' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: /Buka situs resmi/ }).getAttribute('href')).toBe(
      'https://contoh.go.id/',
    );
  });

  it('suggests reading the requirements of a saved program without a berkas', () => {
    saveProgramIds(['pkh']);
    renderInRencana(<RencanaSummary />);
    expect(screen.getByRole('heading', { name: 'Baca syarat PKH.' })).toBeTruthy();
  });
});

describe('RencanaBerkas', () => {
  it('offers programs with a berkas sheet when nothing has been started', () => {
    renderInRencana(<RencanaBerkas />);
    expect(screen.getByText('Belum ada berkas yang kamu siapkan.')).toBeTruthy();
    expect(screen.getByRole('link', { name: /KIP Kuliah/ }).getAttribute('href')).toBe(
      '/kenali-hakmu/kip-kuliah/berkas',
    );
  });

  it('shows saved progress and the personal note', () => {
    saveBerkas({ ekonomi: 'penghasilan' }, ['email'], 'Tanya operator sekolah');
    renderInRencana(<RencanaBerkas />);
    expect(screen.getByText('1 dari 2 dokumen siap')).toBeTruthy();
    expect(screen.getByText('Tanya operator sekolah')).toBeTruthy();
  });

  it('warns that the document count may grow while a question is unanswered', () => {
    saveBerkas({}, ['email']);
    renderInRencana(<RencanaBerkas />);
    expect(screen.getByText(/Jawabanmu belum lengkap/)).toBeTruthy();
  });

  it('moves a sheet back to the suggestions after its entries are cleared', () => {
    saveBerkas({ ekonomi: 'kip' }, ['email']);
    renderInRencana(<RencanaBerkas />);
    fireEvent.click(screen.getByRole('button', { name: /Hapus isian berkas/ }));
    expect(screen.getByText('Belum ada berkas yang kamu siapkan.')).toBeTruthy();
    expect(screen.getByRole('link', { name: /KIP Kuliah/ })).toBeTruthy();
  });
});

describe('RencanaSaved', () => {
  it('shows pulsing placeholders instead of the empty state while saved programs load', () => {
    savedIdsState.isLoading = true;
    renderInRencana(<RencanaSaved />);
    expect(screen.getByRole('status', { name: 'Memuat simpanan' })).toBeTruthy();
    expect(screen.queryByText('Belum ada program yang disimpan')).toBeNull();
  });

  it('opens the step-by-step preparation guide from a saved program', () => {
    saveProgramIds(['pkh']);
    renderInRencana(<RencanaSaved />);
    expect(screen.getByRole('link', { name: 'PKH' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Atur persiapan' }));
    expect(screen.getByRole('article', { name: 'Panduan PKH' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Kembali ke Rencanaku' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Lihat detail program' }).getAttribute('href')).toBe(
      '/kenali-hakmu/pkh',
    );
  });

  it('shows saved public services in their own tab', () => {
    saveProgramIds(['ktp-el']);
    renderInRencana(<RencanaSaved />);
    fireEvent.click(screen.getByRole('button', { name: /Layanan Publik/ }));
    expect(screen.getByRole('link', { name: 'Pengurusan KTP-el' })).toBeTruthy();
  });

  it('keeps an unbookmarked program visible until the page is refreshed', () => {
    saveProgramIds(['pkh']);
    const view = renderInRencana(<RencanaSaved />);
    fireEvent.click(screen.getByRole('button', { name: 'Hapus PKH dari Rencanaku' }));
    expect(screen.getByRole('link', { name: 'PKH' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Simpan PKH ke Rencanaku' })).toBeTruthy();
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('[]');
    fireEvent.click(screen.getByRole('button', { name: 'Simpan PKH ke Rencanaku' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('["pkh"]');
    fireEvent.click(screen.getByRole('button', { name: 'Hapus PKH dari Rencanaku' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('[]');
    view.unmount();
    renderInRencana(<RencanaSaved />);
    expect(screen.queryByRole('link', { name: 'PKH' })).toBeNull();
  });
});

describe('RencanaDeadlines', () => {
  it('orders tracked programs by the soonest deadline and keeps unknown periods last', () => {
    saveProgramIds(['pkh']);
    saveBerkas({ ekonomi: 'kip' }, []);
    renderInRencana(<RencanaDeadlines />);
    const rows = screen.getAllByRole('listitem').map((row) => row.textContent ?? '');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toContain('KIP Kuliah');
    expect(rows[0]).toContain('6 hari lagi');
    expect(rows[1]).toContain('PKH');
    expect(rows[1]).toContain('Cek kanal resmi');
  });

  it('explains where the dates come from', () => {
    saveProgramIds(['pkh']);
    renderInRencana(<RencanaDeadlines />);
    expect(screen.getByText(/bukan dari sistem pemerintah/)).toBeTruthy();
  });
});

describe('RencanaShell', () => {
  it('shows the saved plan without extra section navigation or device data controls', () => {
    renderInRencana(
      <RencanaShell>
        <p>Isi berkas</p>
      </RencanaShell>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Rencanaku' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Bagian Rencanaku' })).toBeNull();
    expect(screen.getByText('Beranda')).toBeTruthy();
    expect(screen.getByText('Isi berkas')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Kosongkan Rencanaku/ })).toBeNull();
  });
});

describe('DeviceDataPanel', () => {
  it('asks for confirmation before wiping everything on the device', () => {
    saveProgramIds(['pkh']);
    saveBerkas({ ekonomi: 'kip' }, ['email']);
    renderInRencana(<DeviceDataPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Kosongkan Rencanaku/ }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('["pkh"]');
    fireEvent.click(screen.getByRole('button', { name: 'Ya, kosongkan' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('[]');
    expect(window.localStorage.getItem(`${BERKAS_STORAGE_PREFIX}kip-kuliah`)).toBe(
      serializeBerkasProgress({ answers: {}, checked: [], note: '' }),
    );
  });

  it('can be cancelled without deleting anything', () => {
    saveProgramIds(['pkh']);
    renderInRencana(<DeviceDataPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Kosongkan Rencanaku/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('["pkh"]');
    expect(screen.getByRole('button', { name: /Kosongkan Rencanaku/ })).toBeTruthy();
  });
});
