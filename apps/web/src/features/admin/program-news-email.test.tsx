import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgramNewsEmail } from './program-news-email';

const preview = {
  subject: 'Kabar Program Contoh: Pendaftaran diperpanjang',
  html: '<p>Isi kabar</p>',
  text: 'Isi kabar',
  eligibleCount: 4,
};

function mockFetch(responses: Array<{ ok: boolean; body: unknown }>) {
  const fetchMock = vi.fn();
  responses.forEach((response) =>
    fetchMock.mockResolvedValueOnce({ ok: response.ok, json: async () => response.body }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function fillForm() {
  fireEvent.change(screen.getByLabelText(/Judul kabar/), {
    target: { value: 'Pendaftaran diperpanjang' },
  });
  fireEvent.change(screen.getByLabelText(/Isi kabar/), {
    target: { value: 'Pendaftaran gelombang kedua diperpanjang sampai akhir bulan.' },
  });
  fireEvent.change(screen.getByLabelText(/Tautan pengumuman resmi/), {
    target: { value: 'https://contoh.go.id/pengumuman' },
  });
}

describe('ProgramNewsEmail', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('previews the email first and sends the news only after confirmation', async () => {
    const fetchMock = mockFetch([
      { ok: true, body: preview },
      { ok: true, body: { newsId: 'n1', sent: 4, failed: 0 } },
    ]);
    render(<ProgramNewsEmail programId="program-contoh" />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Lihat pratinjau email' }));

    expect(
      await screen.findByText('4 pengikut dengan notifikasi email aktif akan menerima kabar ini'),
    ).toBeTruthy();
    expect(screen.getByTitle('Pratinjau tampilan email')).toBeTruthy();
    const firstRequest = fetchMock.mock.calls[0];
    expect(firstRequest?.[0]).toBe('/api/admin/programs/program-contoh/news');
    expect(JSON.parse(String(firstRequest?.[1]?.body))).toMatchObject({
      action: 'preview',
      title: 'Pendaftaran diperpanjang',
      sourceUrl: 'https://contoh.go.id/pengumuman',
    });
    const sendButton = screen.getByRole('button', { name: 'Kirim kabar sekarang' });
    expect((sendButton as HTMLButtonElement).disabled).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText(/siap mengirim email ke 4 pengikut/));
    fireEvent.click(sendButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body)).action).toBe('send');
    expect((await screen.findByRole('status')).textContent).toBe(
      'Pengiriman selesai: 4 email terkirim, 0 gagal.',
    );
  });

  it('drops the preview when the text changes so an old email cannot be sent', async () => {
    mockFetch([{ ok: true, body: preview }]);
    render(<ProgramNewsEmail programId="program-contoh" />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Lihat pratinjau email' }));
    await screen.findByTitle('Pratinjau tampilan email');

    fireEvent.change(screen.getByLabelText(/Judul kabar/), {
      target: { value: 'Judul kabar yang diubah' },
    });

    expect(screen.queryByTitle('Pratinjau tampilan email')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Kirim kabar sekarang' })).toBeNull();
  });

  it('shows the server message when the news cannot be prepared', async () => {
    mockFetch([{ ok: false, body: { error: 'Periksa judul, ringkasan, tanggal, dan tautan.' } }]);
    render(<ProgramNewsEmail programId="program-contoh" />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Lihat pratinjau email' }));

    expect((await screen.findByRole('status')).textContent).toBe(
      'Periksa judul, ringkasan, tanggal, dan tautan.',
    );
  });
});
