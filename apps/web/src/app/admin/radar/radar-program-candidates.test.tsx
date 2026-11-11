import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { RadarProgramCandidates } from './radar-program-candidates';

describe('RadarProgramCandidates', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('moves an approved candidate into program management as unverified', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(
      <RadarProgramCandidates
        initialCandidates={[
          {
            id: '5a9ae941-f6b7-4f3d-86ba-0b4fded17073',
            record: {
              program: makeProgram({ verifikasi: 'belum', tanggalDiperiksa: undefined }),
              evidence: [
                {
                  url: 'https://contoh.go.id/',
                  quote: 'Program bantuan pemerintah untuk warga Indonesia.',
                },
              ],
            },
            status: 'pending',
            detected_at: '2026-11-10T00:00:00Z',
            reviewed_at: null,
            reviewed_by: null,
            program_id: null,
          },
        ]}
      />,
    );

    fireEvent.click(
      screen.getByLabelText(
        'Saya sudah membuka sumber dan memeriksa nama, syarat, periode, wilayah, dan kutipan.',
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Setujui sebagai draf' }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({
      action: 'approve',
      program: { verifikasi: 'belum' },
    });
    expect(
      await screen.findByText('Belum ada kandidat program baru untuk diperiksa.'),
    ).toBeTruthy();
  });
});
