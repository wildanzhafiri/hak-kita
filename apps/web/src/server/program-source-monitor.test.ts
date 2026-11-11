import { describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { collectProgramSourceTargets, collectProgramSourceUrls } from './program-source-monitor';

vi.mock('server-only', () => ({}));

describe('program source monitoring', () => {
  it('watches unique official links from checked program facts', () => {
    const checked = makeProgram({
      sumberUtama: { url: 'https://contoh.go.id/', jenis: 'situs-resmi' },
      sumberTambahan: [{ url: 'https://contoh.go.id/panduan', jenis: 'situs-resmi' }],
      syarat: [
        { teks: 'Syarat resmi', sumberUrl: 'https://contoh.go.id/syarat' },
        { teks: 'Syarat tanpa sumber' },
      ],
    });
    const unchecked = makeProgram({
      id: 'belum',
      verifikasi: 'belum',
      sumberUtama: { url: 'https://belum.go.id/', jenis: 'situs-resmi' },
    });

    const documents = [
      {
        id: 'panduan-contoh',
        programId: checked.id,
        sourceUrl: 'https://contoh.go.id/panduan',
        checkedOn: '2026-11-08',
        passages: [
          { id: 'langkah', title: 'Langkah pengurusan', text: 'Buka situs resmi pengurusan.' },
        ],
      },
    ];

    expect(collectProgramSourceUrls([checked, checked, unchecked], documents)).toEqual([
      'https://contoh.go.id/',
      'https://contoh.go.id/panduan',
      'https://contoh.go.id/syarat',
    ]);
    expect([...collectProgramSourceTargets([checked, unchecked], documents)]).toEqual([
      ['https://contoh.go.id/', [checked]],
      ['https://contoh.go.id/panduan', [checked]],
      ['https://contoh.go.id/syarat', [checked]],
    ]);
  });
});
