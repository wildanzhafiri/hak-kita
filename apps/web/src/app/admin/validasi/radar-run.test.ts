import type { RadarRunEvent } from '@hakkita/schema';
import { describe, expect, it } from 'vitest';
import {
  createRadarRunState,
  markRadarRunStopped,
  readProgressPercent,
  reduceRadarRun,
} from './radar-run';
import { formatElapsed } from './radar-run-copy';

function play(kind: 'discovery' | 'monitoring', events: RadarRunEvent[]) {
  return events.reduce(reduceRadarRun, createRadarRunState(kind, 0));
}

describe('radar run state', () => {
  it('moves the work from agent to agent through one discovery round', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
    ]);

    expect(state.agents.search.status).toBe('working');
    expect(state.agents.read.status).toBe('waiting');

    const afterRead = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'searched', index: 0, found: 7, usedRegisteredSources: false },
      { type: 'read', index: 0, readable: 5 },
      { type: 'drafting', index: 0 },
    ]);

    expect(afterRead.agents.search).toEqual({
      status: 'done',
      note: 'Menemukan 7 halaman .go.id.',
    });
    expect(afterRead.agents.read).toEqual({
      status: 'done',
      note: '5 halaman berhasil dibaca.',
    });
    expect(afterRead.agents.draft.status).toBe('working');
    expect(afterRead.tally.examined).toBe(5);
  });

  it('lists the sources the drafting agent opened without repeating a host', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'drafting', index: 0 },
      { type: 'source-opened', host: 'a.go.id' },
      { type: 'source-opened', host: 'b.go.id' },
      { type: 'source-opened', host: 'a.go.id' },
    ]);

    expect(state.sources.map((source) => source.host)).toEqual(['b.go.id', 'a.go.id']);
    expect(state.currentSource).toBe('a.go.id');
  });

  it('finishes a queued round with a checked draft', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'drafting', index: 0 },
      { type: 'source-opened', host: 'a.go.id' },
      { type: 'checking', index: 0 },
      { type: 'outcome', index: 0, result: 'queued', name: 'Jaminan Aceh', reason: null },
    ]);

    expect(state.agents.draft.note).toBe('Membaca 1 sumber, lalu menyerahkan hasilnya.');
    expect(state.agents.check).toEqual({
      status: 'done',
      note: 'Draf siap ditinjau: Jaminan Aceh.',
    });
    expect(state.tally.flagged).toBe(1);
    expect(state.progress).toEqual({ done: 1, total: 4 });
    expect(state.rounds[0]).toMatchObject({
      tone: 'success',
      text: 'Kandidat baru: Jaminan Aceh.',
    });
  });

  it('blames the agent whose step produced the skip reason', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Beasiswa, Papua' },
      { type: 'drafting', index: 0 },
      { type: 'outcome', index: 0, result: 'skipped', name: null, reason: 'insufficient-evidence' },
    ]);

    expect(state.agents.draft.status).toBe('skipped');
    expect(state.agents.draft.note).toContain('Bukti di halaman belum cukup');
    expect(state.rounds[0]?.tone).toBe('warning');
  });

  it('marks the working agent as failed and keeps the error detail', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'drafting', index: 0 },
      {
        type: 'outcome',
        index: 0,
        result: 'skipped',
        name: null,
        reason: 'error',
        detail: 'AI_APICallError: Model ini menolak permintaan ini.',
      },
    ]);

    expect(state.agents.draft.status).toBe('failed');
    expect(state.rounds[0]).toMatchObject({ tone: 'error' });
    expect(state.rounds[0]?.text).toContain('AI_APICallError');
  });

  it('marks the reader as failed when no page could be read', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'read', index: 0, readable: 0 },
    ]);

    expect(state.agents.read).toEqual({
      status: 'failed',
      note: 'Tidak ada halaman yang bisa dibaca.',
    });
  });

  it('starts every round with fresh agents', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'A' },
      { type: 'source-opened', host: 'a.go.id' },
      { type: 'outcome', index: 0, result: 'skipped', name: null, reason: 'no-pages' },
      { type: 'round', index: 1, total: 4, label: 'B' },
    ]);

    expect(state.sources).toEqual([]);
    expect(state.agents.search.status).toBe('working');
    expect(state.agents.read.status).toBe('waiting');
    expect(state.rounds).toHaveLength(1);
  });

  it('counts monitored sources by outcome', () => {
    const state = play('monitoring', [
      { type: 'started', run: 'monitoring', total: 3 },
      { type: 'source-checked', host: 'a.go.id', outcome: 'unchanged', checked: 1, total: 3 },
      { type: 'source-checked', host: 'b.go.id', outcome: 'changed', checked: 2, total: 3 },
      { type: 'source-checked', host: 'c.go.id', outcome: 'failed', checked: 3, total: 3 },
    ]);

    expect(state.tally).toEqual({ examined: 3, flagged: 1, setAside: 1 });
    expect(state.sources.map((source) => source.tone)).toEqual(['same', 'changed', 'failed']);
    expect(readProgressPercent(state)).toBe(100);
  });

  it('keeps only the most recent sources', () => {
    const events: RadarRunEvent[] = Array.from({ length: 30 }, (_, index) => ({
      type: 'source-checked',
      host: `s${index}.go.id`,
      outcome: 'unchanged',
      checked: index + 1,
      total: 30,
    }));

    expect(play('monitoring', events).sources).toHaveLength(12);
  });

  it('keeps the phase where the run stopped when it fails', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'round', index: 0, total: 4, label: 'Kesehatan, Aceh' },
      { type: 'drafting', index: 0 },
      { type: 'failed', message: 'Agen gagal dijalankan.' },
    ]);

    expect(state.status).toBe('failed');
    expect(state.phase).toBe('draft');
    expect(state.failure).toBe('Agen gagal dijalankan.');
  });

  it('completes the progress bar when the run finishes', () => {
    const state = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'finished', summary: 'Pencarian selesai: 4 pencarian dan 0 kandidat baru.' },
    ]);

    expect(state.status).toBe('done');
    expect(readProgressPercent(state)).toBe(100);
  });

  it('does not change a run that already ended when asked to stop it', () => {
    const done = play('discovery', [
      { type: 'started', run: 'discovery', total: 4 },
      { type: 'finished', summary: 'Selesai' },
    ]);

    expect(markRadarRunStopped(done)).toBe(done);
  });
});

describe('radar time format', () => {
  it('formats elapsed seconds as minutes and seconds', () => {
    expect(formatElapsed(0)).toBe('0:00');
    expect(formatElapsed(65)).toBe('1:05');
  });
});
