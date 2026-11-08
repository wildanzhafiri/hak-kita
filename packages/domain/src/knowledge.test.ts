import { describe, expect, it } from 'vitest';
import { makeProgram } from './test-helpers';
import { buildCuratedKnowledge, buildProgramKnowledge, searchProgramKnowledge } from './knowledge';

describe('program knowledge', () => {
  it('includes only sourced passages from checked programs', () => {
    const checked = makeProgram({
      syarat: [
        { teks: 'Syarat dengan sumber resmi', sumberUrl: 'https://contoh.go.id/syarat' },
        { teks: 'Syarat yang belum punya sumber' },
      ],
      berkas: {
        pertanyaan: [],
        dokumen: [
          {
            id: 'surat',
            label: 'Surat keterangan',
            sumberUrl: 'https://contoh.go.id/berkas',
          },
        ],
        kendala: [
          {
            masalah: 'Nomor tidak dikenali',
            langkah: 'Hubungi kanal resmi',
            sumberUrl: 'https://contoh.go.id/bantuan',
          },
        ],
      },
    });
    const unchecked = makeProgram({ id: 'belum-diperiksa', verifikasi: 'belum' });

    const passages = buildProgramKnowledge([checked, unchecked]);

    expect(passages.map((passage) => passage.section)).toEqual(['syarat', 'berkas', 'kendala']);
    expect(passages.every((passage) => passage.programId === checked.id)).toBe(true);
    expect(passages.every((passage) => passage.checkedOn === '2026-10-20')).toBe(true);
    expect(passages[0]?.sourceUrl).toBe('https://contoh.go.id/syarat');
  });

  it('ranks a relevant obstacle and respects program filtering', () => {
    const first = makeProgram({ id: 'program-satu', nama: 'KIP Kuliah' });
    const second = makeProgram({
      id: 'program-dua',
      nama: 'Program Lain',
      berkas: {
        pertanyaan: [],
        dokumen: [
          { id: 'email', label: 'Alamat email aktif', sumberUrl: 'https://contoh.go.id/email' },
        ],
        kendala: [
          {
            masalah: 'NISN tidak dikenali',
            langkah: 'Hubungi operator sekolah',
            sumberUrl: 'https://contoh.go.id/nisn',
          },
        ],
      },
    });
    const passages = buildProgramKnowledge([first, second]);

    expect(searchProgramKnowledge(passages, 'NISN tidak dikenali')[0]?.section).toBe('kendala');
    expect(searchProgramKnowledge(passages, 'NISN', { programId: first.id })).toEqual([]);
    expect(searchProgramKnowledge(passages, 'dan untuk')).toEqual([]);
  });

  it('retrieves curated guidance with its exact source and check date', () => {
    const program = makeProgram({ id: 'kip-kuliah', nama: 'KIP Kuliah' });
    const curated = buildCuratedKnowledge(
      [
        {
          id: 'faq-kip',
          programId: program.id,
          sourceUrl: 'https://contoh.go.id/panduan',
          checkedOn: '2026-11-08',
          passages: [
            {
              id: 'nisn',
              title: 'NISN tidak terdaftar',
              text: 'Minta operator sekolah memperbarui data sumber di Dapodik.',
            },
          ],
        },
      ],
      [program],
    );

    const results = searchProgramKnowledge(
      [...buildProgramKnowledge([program]), ...curated],
      'NISN tidak terdaftar KIP Kuliah',
    );

    expect(results[0]).toMatchObject({
      id: 'faq-kip:nisn',
      section: 'panduan',
      sourceUrl: 'https://contoh.go.id/panduan',
      checkedOn: '2026-11-08',
    });
    expect(searchProgramKnowledge(curated, 'NISN tidak terdaftar')[0]?.id).toBe('faq-kip:nisn');
  });
});
