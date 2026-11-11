import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { RadarProgramReview } from './radar-program-review';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

const candidateId = '5a9ae941-f6b7-4f3d-86ba-0b4fded17073';
const confirmLabel = 'Saya sudah memeriksa kesesuaian informasi dengan sumber yang tersedia.';

function renderReview(evidenceCount = 1) {
  return render(
    <RadarProgramReview
      candidate={{
        id: candidateId,
        record: {
          program: makeProgram({ verifikasi: 'belum', tanggalDiperiksa: undefined }),
          evidence: Array.from({ length: evidenceCount }, (_, index) => ({
            url: `https://contoh${index}.go.id/`,
            quote: `Kutipan resmi nomor ${index + 1} untuk program bantuan.`,
          })),
        },
        status: 'pending',
        detected_at: '2026-11-10T00:00:00Z',
        reviewed_at: null,
        reviewed_by: null,
        program_id: null,
      }}
      regionName="Nasional"
    />,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('RadarProgramReview', () => {
  it('shows a preview of the new information with every source and its quote', () => {
    renderReview(3);

    expect(screen.getByRole('heading', { name: 'Pratinjau informasi baru' })).toBeTruthy();
    expect(screen.getAllByText('Program Contoh').length).toBeGreaterThan(0);
    expect(screen.getByText('Nasional')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /Buka sumber resmi/ })).toHaveLength(3);
    expect(screen.getByText(/Kutipan resmi nomor 3/)).toBeTruthy();
  });

  it('publishes after the source check and a confirmation', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reviewed: true, programId: 'program-baru' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderReview();

    expect(
      (screen.getByRole('button', { name: 'Setujui & Publikasikan' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByLabelText(confirmLabel));
    fireEvent.click(screen.getByRole('button', { name: 'Setujui & Publikasikan' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Ya, publikasikan' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      action: 'approve',
      candidateId,
      program: { verifikasi: 'belum' },
    });
    expect((await screen.findByRole('status')).textContent).toContain(
      'dipublikasikan dan sudah tampil di HAKKITA',
    );
    expect(
      screen.getByRole('link', { name: 'Lihat di Kelola Informasi' }).getAttribute('href'),
    ).toBe('/admin/informasi/program-baru');
    expect(screen.getByRole('link', { name: 'Kembali ke daftar validasi' })).toBeTruthy();
  });

  it('saves a correction and asks for the check again', async () => {
    const corrected = makeProgram({
      nama: 'Nama Setelah Perbaikan',
      verifikasi: 'belum',
      tanggalDiperiksa: undefined,
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ updated: true, program: corrected }),
    });
    vi.stubGlobal('fetch', fetchMock);
    renderReview();

    fireEvent.click(screen.getByLabelText(confirmLabel));
    fireEvent.click(screen.getByRole('button', { name: 'Perbaiki' }));
    fireEvent.change(await screen.findByDisplayValue('Program Contoh'), {
      target: { value: 'Nama Setelah Perbaikan' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      action: 'update',
      candidateId,
      program: { nama: 'Nama Setelah Perbaikan' },
    });
    expect((await screen.findAllByText('Nama Setelah Perbaikan')).length).toBeGreaterThan(0);
    expect(screen.getByRole('status').textContent).toContain('Perbaikan disimpan');
    expect(
      (screen.getByRole('button', { name: 'Setujui & Publikasikan' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('shows the server message when a correction is rejected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Sumber program harus berasal dari bukti resmi pada temuan' }),
      }),
    );
    renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Perbaiki' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Simpan perubahan' }));

    expect(
      await screen.findByText('Sumber program harus berasal dari bukti resmi pada temuan'),
    ).toBeTruthy();
  });

  it('confirms a rejection and tells the admin where to go back', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ reviewed: true }) }),
    );
    renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Tolak' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Ya, tolak' }));

    expect((await screen.findByRole('status')).textContent).toContain('ditolak dan tidak disimpan');
    expect(screen.getByRole('link', { name: 'Kembali ke daftar validasi' })).toBeTruthy();
  });
});

describe('RadarProgramReview sources', () => {
  it('lists each source once with all of its quotes when one page backs several claims', () => {
    render(
      <RadarProgramReview
        candidate={{
          id: candidateId,
          record: {
            program: makeProgram({ verifikasi: 'belum', tanggalDiperiksa: undefined }),
            evidence: [
              {
                url: 'https://sama.go.id/berita',
                quote: 'Kutipan pertama dari halaman yang sama.',
              },
              { url: 'https://sama.go.id/berita', quote: 'Kutipan kedua dari halaman yang sama.' },
              { url: 'https://lain.go.id/', quote: 'Kutipan dari halaman lain.' },
            ],
          },
          status: 'pending',
          detected_at: '2026-11-10T00:00:00Z',
          reviewed_at: null,
          reviewed_by: null,
          program_id: null,
        }}
        regionName="Nasional"
      />,
    );

    expect(screen.getAllByRole('link', { name: /Buka sumber resmi/ })).toHaveLength(2);
    expect(screen.getByText(/Kutipan pertama/)).toBeTruthy();
    expect(screen.getByText(/Kutipan kedua/)).toBeTruthy();
  });
});

describe('RadarProgramReview details', () => {
  it('keeps the long details in a dropdown and leaves empty data blank', () => {
    renderReview();

    const summary = screen.getByText('Lihat keseluruhan informasi');
    const details = summary.closest('details');
    expect(details).toBeTruthy();
    expect(details?.hasAttribute('open')).toBe(false);
    expect(details?.textContent).toContain('Persyaratan');
    expect(details?.textContent).toContain('Tautan resmi');
    expect(screen.queryByText('Belum tersedia')).toBeNull();
    const aboutRow = screen.getByText('Ringkasan informasi').closest('div');
    expect(aboutRow?.querySelector('dd')?.textContent).toBe('');
  });

  it('shows when each source was found', () => {
    renderReview();

    expect(screen.getByText(/^Ditemukan: .*WIB$/)).toBeTruthy();
  });
});
