import { describe, expect, it } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { attachEvidenceQuotes } from './attach-evidence-quotes';

describe('attachEvidenceQuotes', () => {
  const primaryUrl = 'https://contoh.go.id/program';
  const extraUrl = 'https://contoh.go.id/panduan';

  it('copies the quotes found at a source onto the matching program source', () => {
    const program = makeProgram({
      sumberUtama: { url: primaryUrl, jenis: 'situs-resmi' },
      sumberTambahan: [{ url: extraUrl, jenis: 'situs-resmi' }],
    });

    const result = attachEvidenceQuotes(program, [
      { url: primaryUrl, quote: 'Kutipan pertama dari halaman program.' },
      { url: primaryUrl, quote: 'Kutipan kedua dari halaman program.' },
      { url: extraUrl, quote: 'Kutipan dari halaman panduan resmi.' },
    ]);

    expect(result.sumberUtama.kutipan).toBe(
      'Kutipan pertama dari halaman program.\n\nKutipan kedua dari halaman program.',
    );
    expect(result.sumberTambahan[0]?.kutipan).toBe('Kutipan dari halaman panduan resmi.');
  });

  it('keeps a quote that is already written and ignores unrelated evidence', () => {
    const program = makeProgram({
      sumberUtama: { url: primaryUrl, jenis: 'situs-resmi', kutipan: 'Kutipan yang sudah ada.' },
      sumberTambahan: [],
    });

    const result = attachEvidenceQuotes(program, [
      { url: primaryUrl, quote: 'Kutipan lain dari halaman program.' },
      { url: 'https://lain.go.id/halaman', quote: 'Kutipan dari halaman yang tidak dipakai.' },
    ]);

    expect(result.sumberUtama.kutipan).toBe('Kutipan yang sudah ada.');
    expect(result.sumberTambahan).toEqual([]);
  });
});
