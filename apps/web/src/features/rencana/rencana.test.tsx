import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SAVED_STORAGE_KEY, STEP_PROGRESS_STORAGE_PREFIX } from '@/config/storage';
import { BERKAS, BUILT_ON, WILAYAH, makeProgram } from '@/test/fixtures';
import { RencanaDeadlines } from './rencana-deadlines';
import { RencanaProvider } from './rencana-provider';
import { RencanaSaved } from './rencana-saved';
import { RencanaShell } from './rencana-shell';

const savedIdsState = vi.hoisted(() => ({ isLoading: false }));

vi.mock('next/navigation', () => ({ usePathname: () => '/rencanaku' }));
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

describe('RencanaSaved', () => {
  it('keeps self-marked progress and shows sourced help for a stuck step', async () => {
    saveProgramIds(['kip-kuliah']);
    renderInRencana(<RencanaSaved />);
    fireEvent.click(screen.getByRole('button', { name: 'Atur persiapan' }));
    expect(screen.getByRole('article', { name: 'Panduan KIP Kuliah' })).toBeTruthy();
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
  });

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
    saveProgramIds(['pkh', 'kip-kuliah']);
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
        <p>Isi rencana</p>
      </RencanaShell>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Rencanaku' })).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Bagian Rencanaku' })).toBeNull();
    expect(screen.getByText('Beranda')).toBeTruthy();
    expect(screen.getByText('Isi rencana')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Kosongkan Rencanaku/ })).toBeNull();
  });
});
