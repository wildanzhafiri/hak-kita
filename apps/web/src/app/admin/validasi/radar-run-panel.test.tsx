import type { RadarRunEvent } from '@hakkita/schema';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRadarRunState, markRadarRunStopped, reduceRadarRun } from './radar-run';
import { RadarRunPanel } from './radar-run-panel';

function stateAfter(kind: 'discovery' | 'monitoring', events: RadarRunEvent[]) {
  return events.reduce(reduceRadarRun, createRadarRunState(kind, 0));
}

describe('RadarRunPanel', () => {
  it('tells what the agent is doing right now and which stage it is in', () => {
    const state = stateAfter('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 1, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'searched', index: 1, found: 6, usedRegisteredSources: false },
      { type: 'read', index: 1, readable: 4 },
      { type: 'drafting', index: 1 },
      { type: 'source-opened', host: 'dinkes.acehprov.go.id' },
    ]);

    render(
      <RadarRunPanel state={state} elapsedSeconds={42} onDismiss={vi.fn()} onStop={vi.fn()} />,
    );

    expect(screen.getByText('Agen Penyusun membaca sumber dan menyusun draf')).toBeTruthy();
    expect(screen.getByText('Sedang membaca dinkes.acehprov.go.id.')).toBeTruthy();
    expect(screen.getByText('Putaran 2 dari 4: Kesehatan, Aceh')).toBeTruthy();
    expect(screen.getByText('0:42')).toBeTruthy();
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('25');
    const agents = within(screen.getByRole('list', { name: 'Agen yang bekerja' }));
    expect(agents.getByText('Agen Pencari')).toBeTruthy();
    expect(agents.getByText('Bekerja')).toBeTruthy();
    expect(agents.getByText('Menunggu')).toBeTruthy();
    expect(
      within(screen.getByRole('list', { name: 'Sumber yang dibuka' })).getByText(
        'dinkes.acehprov.go.id',
      ),
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Tutup ringkasan' })).toBeNull();
  });

  it('explains an empty result round by round when the run is done', () => {
    const state = stateAfter('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Beasiswa, Papua' },
      { type: 'outcome', index: 0, result: 'skipped', name: null, reason: 'insufficient-evidence' },
      { type: 'finished', summary: 'Pencarian selesai: 4 pencarian dan 0 kandidat baru.' },
    ]);
    const onDismiss = vi.fn();

    render(
      <RadarRunPanel state={state} elapsedSeconds={95} onDismiss={onDismiss} onStop={vi.fn()} />,
    );

    expect(screen.getByText('Pencarian selesai: 4 pencarian dan 0 kandidat baru.')).toBeTruthy();
    expect(screen.getByText(/Bukti di halaman belum cukup/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Muat ulang halaman' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Tutup ringkasan' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('offers a reload when the run found something to review', () => {
    const state = stateAfter('monitoring', [
      { type: 'started', run: 'monitoring', total: 2 },
      { type: 'source-checked', host: 'a.go.id', outcome: 'changed', checked: 1, total: 2 },
      { type: 'source-checked', host: 'b.go.id', outcome: 'unchanged', checked: 2, total: 2 },
      { type: 'finished', summary: 'Pemeriksaan selesai: 2 sumber diperiksa, 1 berubah, 0 gagal.' },
    ]);

    render(<RadarRunPanel state={state} elapsedSeconds={8} onDismiss={vi.fn()} onStop={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Muat ulang halaman' })).toBeTruthy();
    const sources = within(screen.getByRole('list', { name: 'Sumber yang dibuka' }));
    expect(sources.getByText('a.go.id')).toBeTruthy();
    expect(sources.getByText('berubah')).toBeTruthy();
  });

  it('shows the reason and the last stage when the run fails', () => {
    const state = stateAfter('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'failed', message: 'Koneksi ke agen terputus sebelum pekerjaan selesai.' },
    ]);

    render(<RadarRunPanel state={state} elapsedSeconds={3} onDismiss={vi.fn()} onStop={vi.fn()} />);

    expect(screen.getByText('Pencarian berhenti sebelum selesai')).toBeTruthy();
    expect(screen.getByText('Koneksi ke agen terputus sebelum pekerjaan selesai.')).toBeTruthy();
  });

  it('lets the admin stop a run that is still working', () => {
    const state = stateAfter('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 1, total: 4, label: 'Kesehatan, Aceh' },
    ]);
    const onStop = vi.fn();

    render(<RadarRunPanel state={state} elapsedSeconds={5} onDismiss={vi.fn()} onStop={onStop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hentikan' }));

    expect(onStop).toHaveBeenCalledOnce();
  });

  it('says where a stopped run ended and what was kept', () => {
    const state = markRadarRunStopped(
      stateAfter('discovery', [
        { type: 'started', run: 'discovery', total: 4 },
        { type: 'round', index: 1, total: 4, label: 'Kesehatan, Aceh' },
      ]),
    );

    render(<RadarRunPanel state={state} elapsedSeconds={9} onDismiss={vi.fn()} onStop={vi.fn()} />);

    expect(screen.getByText('Dihentikan di putaran 2 dari 4')).toBeTruthy();
    expect(screen.getByText(/Draf yang belum selesai dibuang/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Hentikan' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Tutup ringkasan' })).toBeTruthy();
  });
});
