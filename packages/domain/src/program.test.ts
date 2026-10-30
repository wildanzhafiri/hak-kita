import { describe, expect, it } from 'vitest';
import { ProgramSchema } from '@hakkita/schema';
import { berkasPath, checkProgram, isLayanan, programPath } from './program';
import { TODAY, makeProgram } from './test-helpers';

describe('ProgramSchema', () => {
  it('rejects verification "dasar" without tanggalDiperiksa', () => {
    const result = ProgramSchema.safeParse({ ...makeProgram(), tanggalDiperiksa: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects verification "lengkap" when a requirement has no sumberUrl', () => {
    const result = ProgramSchema.safeParse({
      ...makeProgram(),
      verifikasi: 'lengkap',
      syarat: [{ teks: 'Syarat tanpa sumber' }],
    });
    expect(result.success).toBe(false);
  });

  it('allows verification "belum" without tanggalDiperiksa', () => {
    const result = ProgramSchema.safeParse({
      ...makeProgram(),
      verifikasi: 'belum',
      tanggalDiperiksa: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a coverage code that does not match its level', () => {
    const result = ProgramSchema.safeParse({
      ...makeProgram(),
      cakupan: { level: 'provinsi', kode: '3205' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a period whose dates are reversed', () => {
    const result = ProgramSchema.safeParse({
      ...makeProgram(),
      periode: { buka: '2026-11-01', tutup: '2026-10-01' },
    });
    expect(result.success).toBe(false);
  });
});

describe('isLayanan', () => {
  it('is true only for the administrative service category', () => {
    expect(isLayanan(makeProgram({ kategori: 'Layanan Administrasi' }))).toBe(true);
    expect(isLayanan(makeProgram({ kategori: 'Pendidikan' }))).toBe(false);
  });
});

describe('programPath', () => {
  it('routes programs to Kenali Hakmu and services to Urus Kebutuhanmu', () => {
    expect(programPath(makeProgram({ id: 'pkh' }))).toBe('/kenali-hakmu/pkh');
    expect(programPath(makeProgram({ id: 'ktp-el', kategori: 'Layanan Administrasi' }))).toBe(
      '/urus-kebutuhanmu/ktp-el',
    );
  });
});

describe('berkasPath', () => {
  it('appends the berkas segment to the program path', () => {
    expect(berkasPath(makeProgram({ id: 'kip-kuliah' }))).toBe('/kenali-hakmu/kip-kuliah/berkas');
  });
});

describe('checkProgram', () => {
  it('passes a fresh program with an official source', () => {
    expect(checkProgram(makeProgram(), { today: TODAY })).toEqual({ errors: [], warnings: [] });
  });

  it('fails an unofficial main source', () => {
    const program = makeProgram({
      sumberUtama: { url: 'https://blog.example.com/', jenis: 'situs-resmi' },
    });
    expect(checkProgram(program, { today: TODAY }).errors).toHaveLength(1);
  });

  it('fails an unofficial source on a requirement', () => {
    const program = makeProgram({
      syarat: [{ teks: 'Syarat', sumberUrl: 'https://media.example.com/a' }],
    });
    expect(checkProgram(program, { today: TODAY }).errors[0]).toMatch(/syarat\[0\]/);
  });

  it('fails a check date in the future', () => {
    const program = makeProgram({ tanggalDiperiksa: '2026-12-01' });
    expect(checkProgram(program, { today: TODAY }).errors).toContain(
      'tanggalDiperiksa berada di masa depan',
    );
  });

  it('warns instead of failing for stale data', () => {
    const program = makeProgram({ tanggalDiperiksa: '2026-05-01' });
    const result = checkProgram(program, { today: TODAY });
    expect(result.errors).toEqual([]);
    expect(result.warnings[0]).toMatch(/lebih dari 90 hari/);
  });

  it('warns for entries that are not verified yet', () => {
    const program = makeProgram({ verifikasi: 'belum', tanggalDiperiksa: undefined });
    const result = checkProgram(program, { today: TODAY });
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain('Belum diverifikasi ke sumber resmi');
  });

  it('fails an unofficial source inside berkas', () => {
    const program = makeProgram({
      berkas: {
        pertanyaan: [],
        dokumen: [{ id: 'email', label: 'Email aktif', sumberUrl: 'https://blog.example.com/' }],
        kendala: [
          {
            masalah: 'Data tidak cocok',
            langkah: 'Hubungi operator',
            sumberUrl: 'http://x.go.id/',
          },
        ],
      },
    });
    const errors = checkProgram(program, { today: TODAY }).errors;
    expect(errors).toContain('berkas.dokumen[0]: sumber harus berdomain .go.id');
    expect(errors).toContain('berkas.kendala[0]: sumber harus memakai https');
  });
});
