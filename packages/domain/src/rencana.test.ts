import { describe, expect, it } from 'vitest';
import { buildDeadline, sortDeadlines } from './rencana';
import { TODAY, makeProgram } from './test-helpers';

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
