import { describe, expect, it } from 'vitest';
import type { Program } from '@hakkita/schema';
import {
  createProgramFollowSnapshot,
  getProgramChanges,
  shouldNotifyProgramNews,
} from './program-follow';

const PROGRAM: Program = {
  id: 'contoh',
  nama: 'Program contoh',
  kategori: 'Pendidikan',
  penyelenggara: 'Instansi contoh',
  ringkasan: 'Ringkasan untuk menguji perubahan program.',
  untuk: ['Pelajar'],
  cakupan: { level: 'nasional', kode: 'ID' },
  tipeGerbang: 'kategori',
  syarat: [{ teks: 'Syarat awal' }],
  langkah: [],
  dokumen: ['Kartu pelajar'],
  periode: { buka: '2026-01-01', tutup: '2026-12-31' },
  sumberUtama: { url: 'https://contoh.go.id/', jenis: 'situs-resmi' },
  verifikasi: 'dasar',
  tanggalDiperiksa: '2026-11-01',
};

describe('program follow changes', () => {
  it('notifies only for news added after following and enabling email', () => {
    expect(
      shouldNotifyProgramNews(
        '2026-11-08T10:00:00Z',
        '2026-11-07T10:00:00Z',
        '2026-11-08T09:00:00Z',
      ),
    ).toBe(true);
    expect(
      shouldNotifyProgramNews(
        '2026-11-08T09:00:00Z',
        '2026-11-07T10:00:00Z',
        '2026-11-08T09:00:00Z',
      ),
    ).toBe(false);
    expect(
      shouldNotifyProgramNews(
        '2026-11-07T09:00:00Z',
        '2026-11-07T10:00:00Z',
        '2026-11-06T10:00:00Z',
      ),
    ).toBe(false);
  });
  it('notifies about meaningful changes to verified data', () => {
    const previous = createProgramFollowSnapshot(PROGRAM, '2026-11-01');
    const updated: Program = {
      ...PROGRAM,
      periode: { buka: '2026-02-01', tutup: '2026-12-31' },
      syarat: [{ teks: 'Syarat baru' }],
    };
    expect(getProgramChanges(previous, updated, '2026-11-01')).toEqual(['periode', 'syarat']);
  });

  it('ignores ordering and cosmetic edits', () => {
    const previous = createProgramFollowSnapshot(
      {
        ...PROGRAM,
        syarat: [{ teks: 'Syarat awal' }, { teks: 'Syarat kedua' }],
      },
      '2026-11-01',
    );
    expect(
      getProgramChanges(
        previous,
        {
          ...PROGRAM,
          syarat: [{ teks: 'Syarat kedua' }, { teks: 'Syarat awal' }],
          ringkasan: 'Ringkasan yang diperbarui',
        },
        '2026-11-01',
      ),
    ).toEqual([]);
  });

  it('does not notify about unverified edits', () => {
    const previous = createProgramFollowSnapshot(PROGRAM, '2026-11-01');
    expect(
      getProgramChanges(
        previous,
        {
          ...PROGRAM,
          verifikasi: 'belum',
          dokumen: ['Dokumen baru'],
        },
        '2026-11-01',
      ),
    ).toEqual([]);
  });

  it('notifies when an announced period opens or closes', () => {
    const upcoming: Program = {
      ...PROGRAM,
      periode: { buka: '2026-11-10', tutup: '2026-11-20' },
    };
    const previous = createProgramFollowSnapshot(upcoming, '2026-11-06');
    expect(getProgramChanges(previous, upcoming, '2026-11-10')).toEqual(['dibuka']);
    expect(getProgramChanges(previous, upcoming, '2026-11-21')).toEqual(['ditutup']);
  });

  it('notifies once when a verified deadline approaches', () => {
    const upcoming: Program = {
      ...PROGRAM,
      periode: { buka: '2026-11-01', tutup: '2026-11-20' },
    };
    const previous = createProgramFollowSnapshot(upcoming, '2026-11-06');
    expect(getProgramChanges(previous, upcoming, '2026-11-13')).toEqual(['tenggat']);
    const seen = createProgramFollowSnapshot(upcoming, '2026-11-13');
    expect(getProgramChanges(seen, upcoming, '2026-11-14')).toEqual([]);
  });
});
