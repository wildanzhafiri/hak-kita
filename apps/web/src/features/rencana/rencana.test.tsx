import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { serializeBerkasProgress } from '@hakkita/domain';
import { BERKAS_STORAGE_PREFIX, SAVED_STORAGE_KEY } from '@/config/storage';
import { BERKAS, BUILT_ON, WILAYAH, makeProgram } from '@/test/fixtures';
import { DeviceDataPanel } from './device-data-panel';
import { RencanaBerkas } from './rencana-berkas';
import { RencanaDeadlines } from './rencana-deadlines';
import { RencanaNav } from './rencana-nav';
import { RencanaProvider } from './rencana-provider';
import { RencanaSaved } from './rencana-saved';
import { RencanaShell } from './rencana-shell';
import { RencanaSummary } from './rencana-summary';
import { useRencanaState } from './rencana-context';

vi.mock('next/navigation', () => ({ usePathname: () => '/rencanaku/berkas' }));

const PROGRAMS = [
  makeProgram({
    id: 'kip-kuliah',
    nama: 'KIP Kuliah',
    berkas: BERKAS,
    periode: { buka: '2026-02-03', tutup: '2026-11-05' },
  }),
  makeProgram({ id: 'pkh', nama: 'PKH' }),
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

function NavWithCounts() {
  const { entries, saved, deadlines } = useRencanaState();
  return (
    <RencanaNav
      counts={{ berkas: entries.length, tersimpan: saved.length, tenggat: deadlines.length }}
    />
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-30T05:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('RencanaSummary', () => {
  it('invites the visitor to explore when nothing has been saved or started', () => {
    renderInRencana(<RencanaSummary />);
    expect(screen.getByRole('heading', { name: 'Mulai dari satu program.' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Jelajahi program/ }).getAttribute('href')).toBe(
      '/program',
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
      '/program/kip-kuliah/berkas',
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
      '/program/kip-kuliah/berkas',
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
    fireEvent.click(screen.getByRole('button', { name: /Hapus isian dari perangkat ini/ }));
    expect(screen.getByText('Belum ada berkas yang kamu siapkan.')).toBeTruthy();
    expect(screen.getByRole('link', { name: /KIP Kuliah/ })).toBeTruthy();
  });
});

describe('RencanaSaved', () => {
  it('lists saved programs and removes one when it is unsaved', () => {
    saveProgramIds(['pkh']);
    renderInRencana(<RencanaSaved />);
    expect(screen.getByRole('link', { name: 'PKH' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Hapus PKH dari Rencanaku' }));
    expect(screen.getByText('Belum ada program tersimpan.')).toBeTruthy();
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

describe('RencanaNav', () => {
  it('marks the current page and shows how many items each menu holds', () => {
    saveProgramIds(['pkh']);
    saveBerkas({ ekonomi: 'kip' }, []);
    renderInRencana(<NavWithCounts />);
    expect(screen.getByRole('link', { name: /Berkas/ }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: /Ringkasan/ }).getAttribute('aria-current')).toBeNull();
    expect(screen.getByRole('link', { name: /Tersimpan/ }).textContent).toContain('1');
    expect(screen.getByRole('link', { name: /Tenggat/ }).textContent).toContain('2');
  });
});

describe('RencanaShell', () => {
  it('shows a page title and personal navigation without a public page banner', () => {
    renderInRencana(
      <RencanaShell>
        <p>Isi berkas</p>
      </RencanaShell>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Berkas yang kamu siapkan' }),
    ).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'List Rencanaku' })).toBeTruthy();
    expect(screen.getByText('Isi berkas')).toBeTruthy();
  });
});

describe('DeviceDataPanel', () => {
  it('asks for confirmation before wiping everything on the device', () => {
    saveProgramIds(['pkh']);
    saveBerkas({ ekonomi: 'kip' }, ['email']);
    renderInRencana(<DeviceDataPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Hapus semua data di perangkat ini/ }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('["pkh"]');
    fireEvent.click(screen.getByRole('button', { name: 'Ya, hapus semuanya' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('[]');
    expect(window.localStorage.getItem(`${BERKAS_STORAGE_PREFIX}kip-kuliah`)).toBe(
      serializeBerkasProgress({ answers: {}, checked: [], note: '' }),
    );
  });

  it('can be cancelled without deleting anything', () => {
    saveProgramIds(['pkh']);
    renderInRencana(<DeviceDataPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Hapus semua data di perangkat ini/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Batal' }));
    expect(window.localStorage.getItem(SAVED_STORAGE_KEY)).toBe('["pkh"]');
    expect(screen.getByRole('button', { name: /Hapus semua data di perangkat ini/ })).toBeTruthy();
  });
});
