import { describe, expect, it } from 'vitest';
import { BerkasSchema, type Program } from '@hakkita/schema';
import { buildDeadline, isBerkasComplete, pickNextStep, sortDeadlines } from './rencana';
import { TODAY, makeProgram } from './test-helpers';
import { hasBerkas } from './program';
import type { BerkasEntry } from './types';

const BERKAS = BerkasSchema.parse({
  dokumen: [{ id: 'email', label: 'Email aktif', sumberUrl: 'https://contoh.go.id/panduan' }],
});

function makeEntry(overrides: Partial<Program>, ready: number, total: number): BerkasEntry {
  const [program] = [makeProgram({ berkas: BERKAS, ...overrides })].filter(hasBerkas);
  if (!program) throw new Error('program without berkas');
  return { program, readiness: { ready, total }, hasUnanswered: false };
}

describe('isBerkasComplete', () => {
  it('needs every document ready and every question answered', () => {
    expect(isBerkasComplete(makeEntry({}, 2, 2))).toBe(true);
    expect(isBerkasComplete(makeEntry({}, 1, 2))).toBe(false);
    expect(isBerkasComplete({ ...makeEntry({}, 2, 2), hasUnanswered: true })).toBe(false);
  });

  it('is never complete for an empty document list', () => {
    expect(isBerkasComplete(makeEntry({}, 0, 0))).toBe(false);
  });
});

describe('buildDeadline', () => {
  it('counts the days left while the period is open', () => {
    const deadline = buildDeadline(
      makeProgram({ periode: { buka: '2026-02-03', tutup: '2026-10-31' } }),
      TODAY,
    );
    expect(deadline).toMatchObject({ status: 'dibuka', closesOn: '2026-10-31', daysLeft: 1 });
  });

  it('has no day count for a closed period or one without dates', () => {
    const closed = buildDeadline(
      makeProgram({ periode: { buka: '2026-01-01', tutup: '2026-02-01' } }),
      TODAY,
    );
    expect(closed).toMatchObject({ status: 'ditutup', daysLeft: null });
    expect(buildDeadline(makeProgram(), TODAY)).toMatchObject({
      status: 'tidak-diketahui',
      closesOn: null,
      daysLeft: null,
    });
  });
});

describe('sortDeadlines', () => {
  it('puts the soonest open deadline first and closed periods last', () => {
    const late = makeProgram({ id: 'late', periode: { buka: '2026-01-01', tutup: '2026-12-31' } });
    const soon = makeProgram({ id: 'soon', periode: { buka: '2026-01-01', tutup: '2026-11-05' } });
    const closed = makeProgram({
      id: 'closed',
      periode: { buka: '2026-01-01', tutup: '2026-02-01' },
    });
    const unknown = makeProgram({ id: 'unknown' });
    const always = makeProgram({ id: 'always', periode: 'sepanjang-tahun' });
    const sorted = sortDeadlines(
      [closed, unknown, late, always, soon].map((program) => buildDeadline(program, TODAY)),
    );
    expect(sorted.map((d) => d.program.id)).toEqual([
      'soon',
      'late',
      'always',
      'unknown',
      'closed',
    ]);
  });
});

describe('pickNextStep', () => {
  it('continues the unfinished berkas that closes first', () => {
    const later = makeEntry(
      { id: 'later', periode: { buka: '2026-01-01', tutup: '2026-12-31' } },
      1,
      3,
    );
    const sooner = makeEntry(
      { id: 'sooner', periode: { buka: '2026-01-01', tutup: '2026-11-05' } },
      0,
      2,
    );
    const step = pickNextStep({ entries: [later, sooner], saved: [], today: TODAY });
    expect(step).toMatchObject({ kind: 'continue-berkas', entry: { program: { id: 'sooner' } } });
  });

  it('skips finished sheets while another one is still open', () => {
    const done = makeEntry({ id: 'done' }, 2, 2);
    const open = makeEntry({ id: 'open' }, 0, 2);
    const step = pickNextStep({ entries: [done, open], saved: [], today: TODAY });
    expect(step).toMatchObject({ kind: 'continue-berkas', entry: { program: { id: 'open' } } });
  });

  it('points to the official site once every sheet is complete', () => {
    const step = pickNextStep({
      entries: [makeEntry({ id: 'done' }, 2, 2)],
      saved: [],
      today: TODAY,
    });
    expect(step).toMatchObject({ kind: 'open-official', program: { id: 'done' } });
  });

  it('suggests starting a berkas for a saved program that has one', () => {
    const saved = makeProgram({ id: 'kip-kuliah', berkas: BERKAS });
    expect(pickNextStep({ entries: [], saved: [saved], today: TODAY })).toMatchObject({
      kind: 'start-berkas',
    });
  });

  it('suggests reading the requirements of a saved program without a berkas', () => {
    const saved = makeProgram({ id: 'pkh' });
    expect(pickNextStep({ entries: [], saved: [saved], today: TODAY })).toMatchObject({
      kind: 'review-saved',
      program: { id: 'pkh' },
    });
  });

  it('falls back to exploring when nothing has been saved or started', () => {
    expect(pickNextStep({ entries: [], saved: [], today: TODAY })).toEqual({ kind: 'explore' });
  });
});
