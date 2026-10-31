import { describe, expect, it } from 'vitest';
import { BerkasSchema } from '@hakkita/schema';
import {
  EMPTY_BERKAS_PROGRESS,
  berkasReadiness,
  hasBerkasProgress,
  parseBerkasProgress,
  prunedChecked,
  selectDokumen,
  serializeBerkasProgress,
  unansweredQuestions,
} from './berkas';

const SOURCE = 'https://contoh.go.id/panduan';

const berkas = BerkasSchema.parse({
  pertanyaan: [
    {
      id: 'ekonomi',
      teks: 'Apa dasar keterbatasan ekonomimu?',
      pilihan: [
        { nilai: 'kip', label: 'Punya KIP' },
        { nilai: 'penghasilan', label: 'Penghasilan di bawah UMP' },
      ],
    },
  ],
  dokumen: [
    { id: 'email', label: 'Email aktif', sumberUrl: SOURCE },
    {
      id: 'sktm',
      label: 'SKTM',
      kondisi: { pertanyaan: 'ekonomi', nilai: ['penghasilan'] },
      sumberUrl: SOURCE,
    },
  ],
  kendala: [],
});

describe('BerkasSchema', () => {
  it('rejects a condition that points to an unknown question', () => {
    const result = BerkasSchema.safeParse({
      dokumen: [
        {
          id: 'sktm',
          label: 'SKTM',
          kondisi: { pertanyaan: 'tidak-ada', nilai: ['x'] },
          sumberUrl: SOURCE,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a condition value that is not an option of the question', () => {
    const result = BerkasSchema.safeParse({
      ...berkas,
      dokumen: [
        {
          id: 'sktm',
          label: 'SKTM',
          kondisi: { pertanyaan: 'ekonomi', nilai: ['lainnya'] },
          sumberUrl: SOURCE,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate document ids', () => {
    const result = BerkasSchema.safeParse({
      dokumen: [
        { id: 'email', label: 'Email aktif', sumberUrl: SOURCE },
        { id: 'email', label: 'Email lain', sumberUrl: SOURCE },
      ],
    });
    expect(result.success).toBe(false);
  });
});

describe('selectDokumen', () => {
  it('always includes documents without a condition', () => {
    expect(selectDokumen(berkas, {}).map((d) => d.id)).toEqual(['email']);
  });

  it('adds conditional documents when the answer matches', () => {
    expect(selectDokumen(berkas, { ekonomi: 'penghasilan' }).map((d) => d.id)).toEqual([
      'email',
      'sktm',
    ]);
  });

  it('leaves conditional documents out when the answer does not match', () => {
    expect(selectDokumen(berkas, { ekonomi: 'kip' }).map((d) => d.id)).toEqual(['email']);
  });
});

describe('unansweredQuestions', () => {
  it('lists questions without an answer', () => {
    expect(unansweredQuestions(berkas, {}).map((q) => q.id)).toEqual(['ekonomi']);
    expect(unansweredQuestions(berkas, { ekonomi: 'kip' })).toEqual([]);
  });
});

describe('berkasReadiness', () => {
  it('counts checked documents among the visible ones', () => {
    const docs = selectDokumen(berkas, { ekonomi: 'penghasilan' });
    expect(berkasReadiness(docs, ['sktm'])).toEqual({ ready: 1, total: 2 });
  });

  it('ignores checked ids that are no longer visible', () => {
    const docs = selectDokumen(berkas, { ekonomi: 'kip' });
    expect(berkasReadiness(docs, ['sktm', 'email'])).toEqual({ ready: 1, total: 1 });
  });
});

describe('prunedChecked', () => {
  it('drops checked ids of documents that are hidden', () => {
    const docs = selectDokumen(berkas, { ekonomi: 'kip' });
    expect(prunedChecked(['sktm', 'email'], docs)).toEqual(['email']);
  });
});

describe('parseBerkasProgress', () => {
  it('returns an empty progress when nothing is stored', () => {
    expect(parseBerkasProgress(null)).toEqual(EMPTY_BERKAS_PROGRESS);
  });

  it('survives corrupted storage', () => {
    expect(parseBerkasProgress('{rusak')).toEqual(EMPTY_BERKAS_PROGRESS);
    expect(parseBerkasProgress('42')).toEqual(EMPTY_BERKAS_PROGRESS);
    expect(parseBerkasProgress('null')).toEqual(EMPTY_BERKAS_PROGRESS);
  });

  it('keeps valid fields and resets invalid ones', () => {
    const parsed = parseBerkasProgress(
      JSON.stringify({ answers: { ekonomi: 'kip' }, checked: 'bukan-array', note: 5 }),
    );
    expect(parsed).toEqual({ answers: { ekonomi: 'kip' }, checked: [], note: '' });
  });

  it('round-trips through serialize', () => {
    const progress = { answers: { ekonomi: 'kip' }, checked: ['email'], note: 'Tanya operator' };
    expect(parseBerkasProgress(serializeBerkasProgress(progress))).toEqual(progress);
  });

  it('truncates a note that is too long', () => {
    const progress = { answers: {}, checked: [], note: 'a'.repeat(900) };
    expect(parseBerkasProgress(serializeBerkasProgress(progress)).note).toHaveLength(500);
  });
});

describe('hasBerkasProgress', () => {
  it('is false for an untouched sheet', () => {
    expect(hasBerkasProgress(EMPTY_BERKAS_PROGRESS)).toBe(false);
  });

  it('is false when the note holds only whitespace', () => {
    expect(hasBerkasProgress({ answers: {}, checked: [], note: '   ' })).toBe(false);
  });

  it('is true once an answer, a check mark or a note exists', () => {
    expect(hasBerkasProgress({ answers: { ekonomi: 'kip' }, checked: [], note: '' })).toBe(true);
    expect(hasBerkasProgress({ answers: {}, checked: ['email'], note: '' })).toBe(true);
    expect(hasBerkasProgress({ answers: {}, checked: [], note: 'Tanya operator' })).toBe(true);
  });
});
