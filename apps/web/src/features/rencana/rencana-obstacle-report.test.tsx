import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RencanaObstacleReport } from './rencana-obstacle-report';
import type { RencanaTurnstileProps } from './types';

vi.mock('./rencana-turnstile', () => ({
  RencanaTurnstile: ({ onToken }: RencanaTurnstileProps) => (
    <button type="button" onClick={() => onToken('verified-token')}>
      Selesaikan verifikasi
    </button>
  ),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('RencanaObstacleReport', () => {
  it('keeps source-backed guidance usable when reporting is not configured', () => {
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', '');
    render(<RencanaObstacleReport programId="kip-kuliah" />);
    expect(screen.getByText(/Laporan anonim belum dapat dikirim/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Kirim laporan anonim' })).toBeNull();
  });

  it('requires explicit consent and sends only a stage and national code', async () => {
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'site-key');
    const request = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ accepted: true }),
    });
    vi.stubGlobal('fetch', request);
    render(<RencanaObstacleReport programId="kip-kuliah" />);

    fireEvent.click(screen.getByRole('button', { name: 'Laporkan kendala secara anonim' }));
    expect(
      screen.getByRole('button', { name: 'Kirim laporan anonim' }).hasAttribute('disabled'),
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Pilih tahap/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'Menyiapkan berkas' }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Saya setuju mengirim tahap kendala/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Selesaikan verifikasi' }));
    fireEvent.click(screen.getByRole('button', { name: 'Kirim laporan anonim' }));

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    const sentBody = JSON.parse(request.mock.calls[0]?.[1]?.body ?? '{}');
    expect(sentBody).toEqual({
      programId: 'kip-kuliah',
      stage: 'menyiapkan-berkas',
      regionCode: 'ID',
      turnstileToken: 'verified-token',
      consent: true,
    });
    expect(await screen.findByRole('status')).toHaveProperty(
      'textContent',
      expect.stringContaining('Laporan anonim sudah diterima'),
    );
  });
});
