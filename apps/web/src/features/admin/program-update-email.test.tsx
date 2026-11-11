import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProgramUpdateEmail } from './program-update-email';

const previewWithChanges = {
  followers: 5,
  recipients: 3,
  changes: ['periode', 'syarat'],
  subject: 'Pembaruan Program Contoh di HAKKITA',
  html: '<p>Isi email</p>',
  text: 'Isi email',
  isExample: false,
};

function mockFetch(responses: Array<{ ok: boolean; body: unknown }>) {
  const fetchMock = vi.fn();
  responses.forEach((response) =>
    fetchMock.mockResolvedValueOnce({ ok: response.ok, json: async () => response.body }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('ProgramUpdateEmail', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('shows the email preview at once and sends only after the admin confirms', async () => {
    const fetchMock = mockFetch([
      { ok: true, body: previewWithChanges },
      { ok: true, body: { checked: 5, sent: 3, failed: 0 } },
    ]);
    render(<ProgramUpdateEmail programId="program-contoh" />);

    expect(await screen.findByText('3 akan menerima email karena ada perubahan')).toBeTruthy();
    expect(screen.getByText('5 pengikut dengan notifikasi email aktif')).toBeTruthy();
    expect(screen.getByText(/Periode pendaftaran berubah, Persyaratan berubah/)).toBeTruthy();
    expect(screen.getByTitle('Pratinjau tampilan email')).toBeTruthy();
    const sendButton = screen.getByRole('button', { name: 'Kirim email sekarang' });
    expect((sendButton as HTMLButtonElement).disabled).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByLabelText(
        'Saya sudah memeriksa isi perubahan dan siap mengirim email ke 3 pengikut.',
      ),
    );
    fireEvent.click(sendButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1]?.[0]).toBe('/api/admin/programs/program-contoh/email');
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({ method: 'POST' });
    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body)).action).toBe('send');
    expect((await screen.findByRole('status')).textContent).toBe(
      'Pengiriman selesai: 3 email terkirim, 0 gagal.',
    );
  });

  it('shows an example email but no send button when nobody has a change to hear about', async () => {
    mockFetch([
      {
        ok: true,
        body: {
          followers: 2,
          recipients: 0,
          changes: [],
          subject: 'Pembaruan Program Contoh di HAKKITA',
          html: '<p>Contoh email</p>',
          text: 'Contoh email',
          isExample: true,
        },
      },
    ]);
    render(<ProgramUpdateEmail programId="program-contoh" />);

    expect(
      await screen.findByText(
        'Belum ada perubahan yang perlu dikabarkan. Semua pengikut sudah menerima versi terbaru.',
      ),
    ).toBeTruthy();
    expect(screen.getByText(/Ini contoh tampilan email/)).toBeTruthy();
    expect(screen.getByTitle('Pratinjau tampilan email')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Kirim email sekarang' })).toBeNull();
  });

  it('lets the admin add a message and blocks sending until the preview shows it', async () => {
    const fetchMock = mockFetch([
      { ok: true, body: previewWithChanges },
      { ok: true, body: previewWithChanges },
    ]);
    render(<ProgramUpdateEmail programId="program-contoh" />);
    await screen.findByText('3 akan menerima email karena ada perubahan');

    fireEvent.change(screen.getByLabelText(/Pesan tambahan untuk pengikut/), {
      target: { value: 'Pendaftaran diperpanjang sampai akhir bulan.' },
    });

    expect(screen.getByText(/Perbarui pratinjau dulu sebelum mengirim/)).toBeTruthy();
    const checkbox = screen.getByLabelText(/siap mengirim email ke 3 pengikut/);
    expect(
      checkbox.hasAttribute('disabled') || checkbox.getAttribute('aria-disabled') === 'true',
    ).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Perbarui pratinjau' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body))).toEqual({
      action: 'preview',
      note: 'Pendaftaran diperpanjang sampai akhir bulan.',
    });
    await waitFor(() =>
      expect(screen.queryByText(/Perbarui pratinjau dulu sebelum mengirim/)).toBeNull(),
    );
  });

  it('loads the preview again when it is remounted after a save', async () => {
    const fetchMock = mockFetch([
      { ok: true, body: previewWithChanges },
      { ok: true, body: previewWithChanges },
    ]);
    const { rerender } = render(<ProgramUpdateEmail key={0} programId="program-contoh" />);
    await screen.findByText('3 akan menerima email karena ada perubahan');

    rerender(<ProgramUpdateEmail key={1} programId="program-contoh" />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it('reports a preview that cannot be loaded', async () => {
    mockFetch([{ ok: false, body: { error: 'x' } }]);
    render(<ProgramUpdateEmail programId="program-contoh" />);

    expect((await screen.findByRole('status')).textContent).toBe(
      'Pratinjau email belum dapat dimuat.',
    );
  });
});
