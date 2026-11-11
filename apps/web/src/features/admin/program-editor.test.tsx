import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BERKAS, makeProgram } from '@/test/fixtures';
import { ProgramEditor } from './program-editor';

const router = vi.hoisted(() => ({ refresh: vi.fn(), replace: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => router }));

describe('ProgramEditor', () => {
  beforeEach(() => {
    router.refresh.mockReset();
    router.replace.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('switches the category list when changing the information kind', () => {
    render(<ProgramEditor />);

    fireEvent.click(screen.getByRole('button', { name: /Jenis informasi/ }));
    fireEvent.click(screen.getByRole('option', { name: 'Layanan' }));

    expect(screen.getByRole('button', { name: /Kependudukan & Dokumen Pribadi/ })).toBeTruthy();
  });

  it('creates a new unverified program through the admin endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ created: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramEditor />);

    fireEvent.change(screen.getByLabelText('Nama program atau layanan'), {
      target: { value: 'Program Contoh Baru' },
    });
    fireEvent.change(screen.getByLabelText('Instansi'), {
      target: { value: 'Kementerian Contoh' },
    });
    fireEvent.change(screen.getByLabelText('Deskripsi singkat'), {
      target: { value: 'Ringkasan program baru untuk warga.' },
    });
    fireEvent.change(screen.getByLabelText('Untuk siapa'), { target: { value: 'Warga' } });
    fireEvent.change(screen.getByLabelText('Persyaratan 1'), {
      target: { value: 'Syarat resmi program' },
    });
    fireEvent.change(screen.getByLabelText('Tautan bukti persyaratan (opsional) 1'), {
      target: { value: 'https://contoh.go.id/syarat' },
    });
    fireEvent.change(screen.getByLabelText('Tautan resmi'), {
      target: { value: 'https://contoh.go.id/program' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tambah sumber resmi' }));
    fireEvent.change(screen.getByLabelText('Tautan sumber 2'), {
      target: { value: 'https://contoh.go.id/panduan' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan informasi' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const request = fetchMock.mock.calls[0]?.[1];
    expect(request?.method).toBe('POST');
    expect(JSON.parse(String(request?.body))).toMatchObject({
      id: 'program-contoh-baru',
      verifikasi: 'belum',
      kategori: 'Pendidikan',
      sumberTambahan: [{ url: 'https://contoh.go.id/panduan', jenis: 'situs-resmi' }],
    });
    expect(router.replace).toHaveBeenCalledWith('/admin/informasi/program-contoh-baru');
  });

  it('preserves advanced program details while updating common fields', async () => {
    const program = makeProgram({
      catatan: 'Pastikan informasi ini dicek kembali.',
      kriteria: [{ kelompok: ['calon-mahasiswa'], syaratIndex: 0 }],
      periode: { buka: '2026-01-01', tutup: '2026-12-31' },
      berkas: BERKAS,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ updated: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramEditor onCancel={vi.fn()} program={program} />);

    fireEvent.change(screen.getByLabelText('Deskripsi singkat'), {
      target: { value: 'Ringkasan yang telah diperbarui untuk warga.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const request = fetchMock.mock.calls[0]?.[1];
    const updatedProgram = JSON.parse(String(request?.body));
    expect(request?.method).toBe('PATCH');
    expect(updatedProgram).toMatchObject({
      id: program.id,
      catatan: 'Pastikan informasi ini dicek kembali.',
      kriteria: program.kriteria,
      periode: program.periode,
      berkas: program.berkas,
    });
  });

  it('saves ordered steps and a date range entered through the form', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ created: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramEditor />);

    fireEvent.change(screen.getByLabelText('Nama program atau layanan'), {
      target: { value: 'Program Contoh Baru' },
    });
    fireEvent.change(screen.getByLabelText('Instansi'), {
      target: { value: 'Kementerian Contoh' },
    });
    fireEvent.change(screen.getByLabelText('Deskripsi singkat'), {
      target: { value: 'Ringkasan program baru untuk warga.' },
    });
    fireEvent.change(screen.getByLabelText('Untuk siapa'), { target: { value: 'Warga' } });
    fireEvent.change(screen.getByLabelText('Persyaratan 1'), {
      target: { value: 'Syarat resmi program' },
    });
    fireEvent.change(screen.getByLabelText('Tautan resmi'), {
      target: { value: 'https://contoh.go.id/program' },
    });
    fireEvent.change(screen.getByLabelText('Langkah / prosedur'), {
      target: { value: 'Daftar melalui laman resmi\nUnggah berkas yang diminta' },
    });
    const periodControl = screen.getAllByText('Belum ditentukan')[0];
    if (!periodControl) throw new Error('Period control was not rendered');
    fireEvent.click(periodControl);
    fireEvent.click(await screen.findByRole('option', { name: 'Periode dengan tanggal' }));
    fireEvent.change(screen.getByLabelText('Tanggal mulai'), { target: { value: '2026-01-01' } });
    fireEvent.change(screen.getByLabelText('Tanggal selesai'), {
      target: { value: '2026-12-31' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan informasi' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const request = fetchMock.mock.calls[0]?.[1];
    expect(JSON.parse(String(request?.body))).toMatchObject({
      langkah: ['Daftar melalui laman resmi', 'Unggah berkas yang diminta'],
      periode: { buka: '2026-01-01', tutup: '2026-12-31' },
    });
  });

  it('keeps optional fields empty and saves them only when filled in', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ created: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramEditor />);

    fireEvent.change(screen.getByLabelText('Nama program atau layanan'), {
      target: { value: 'Program Opsional' },
    });
    fireEvent.change(screen.getByLabelText('Instansi'), {
      target: { value: 'Kementerian Contoh' },
    });
    fireEvent.change(screen.getByLabelText('Deskripsi singkat'), {
      target: { value: 'Deskripsi singkat program untuk warga.' },
    });
    fireEvent.change(screen.getByLabelText('Untuk siapa'), { target: { value: 'Warga' } });
    fireEvent.change(screen.getByLabelText('Persyaratan 1'), {
      target: { value: 'Syarat resmi program' },
    });
    fireEvent.change(screen.getByLabelText('Tautan resmi'), {
      target: { value: 'https://contoh.go.id/program' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan informasi' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body).not.toHaveProperty('tentang');
    expect(body).not.toHaveProperty('biaya');
    expect(body).not.toHaveProperty('periode');
    expect(body.langkah).toEqual([]);
  });

  it('saves the information summary and the cost when they are filled in', async () => {
    const program = makeProgram({
      tentang: 'Penjelasan lama yang cukup panjang.',
      biaya: 'Gratis',
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ updated: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramEditor onCancel={vi.fn()} program={program} />);

    expect(screen.getByLabelText('Ringkasan informasi')).toHaveProperty(
      'value',
      'Penjelasan lama yang cukup panjang.',
    );
    fireEvent.change(screen.getByLabelText('Ringkasan informasi'), {
      target: { value: 'Penjelasan baru yang lebih lengkap.' },
    });
    fireEvent.change(screen.getByLabelText('Biaya'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.tentang).toBe('Penjelasan baru yang lebih lengkap.');
    expect(body).not.toHaveProperty('biaya');
  });

  it('saves the quote evidence of each requirement and each source', async () => {
    const program = makeProgram({
      syarat: [{ teks: 'Warga setempat', kutipan: 'Kutipan lama dari halaman resmi.' }],
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ updated: true }) });
    vi.stubGlobal('fetch', fetchMock);
    render(<ProgramEditor onCancel={vi.fn()} program={program} />);

    expect(screen.getByLabelText('Bukti / kutipan (jika tersedia) persyaratan 1')).toHaveProperty(
      'value',
      'Kutipan lama dari halaman resmi.',
    );
    fireEvent.change(screen.getByLabelText('Bukti / kutipan (jika tersedia) persyaratan 1'), {
      target: { value: 'Kutipan persyaratan yang baru.' },
    });
    fireEvent.change(screen.getByLabelText('Bukti / kutipan sumber utama (jika tersedia)'), {
      target: { value: 'Kutipan sumber utama.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tambah sumber resmi' }));
    fireEvent.change(screen.getByLabelText('Tautan sumber 2'), {
      target: { value: 'https://contoh.go.id/panduan' },
    });
    fireEvent.change(screen.getByLabelText('Bukti / kutipan (jika tersedia) sumber 2'), {
      target: { value: 'Kutipan sumber tambahan.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.syarat[0].kutipan).toBe('Kutipan persyaratan yang baru.');
    expect(body.sumberUtama.kutipan).toBe('Kutipan sumber utama.');
    expect(body.sumberTambahan[0]).toMatchObject({
      url: 'https://contoh.go.id/panduan',
      kutipan: 'Kutipan sumber tambahan.',
    });
  });

  it('puts every label above its field, including the selects, so rows line up', () => {
    render(<ProgramEditor />);

    for (const label of ['Jenis informasi', 'Kategori', 'Cakupan wilayah', 'Dasar akses']) {
      const visible = screen
        .getAllByText(label)
        .some((node) => !node.className.includes('sr-only'));
      expect(visible).toBe(true);
    }
  });
});
