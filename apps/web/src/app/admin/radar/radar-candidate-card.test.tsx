import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RadarCandidateCard } from './radar-candidate-card';

afterEach(() => vi.unstubAllGlobals());

describe('RadarCandidateCard', () => {
  it('requires source confirmation before publishing an edited finding', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    const onReviewed = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(
      <RadarCandidateCard
        candidate={{
          id: 'c9344ab5-bccb-4214-8e2e-218a81d625bc',
          program_id: 'kip-kuliah',
          program_name: 'KIP Kuliah',
          source_url: 'https://kip-kuliah.kemdiktisaintek.go.id/panduan',
          source_fingerprint: 'a'.repeat(64),
          evidence_quote: 'Pendaftaran baru dibuka untuk calon mahasiswa tahun ini.',
          draft_title: 'Pendaftaran KIP Kuliah dibuka',
          draft_summary: 'Sumber resmi mengumumkan pembukaan pendaftaran KIP Kuliah tahun ini.',
          draft_email_text:
            'Pendaftaran KIP Kuliah telah dibuka. Periksa jadwal dan syarat di kanal resmi.',
          published_on: '2026-11-10',
          status: 'pending',
          detected_at: '2026-11-10T03:00:00Z',
          reviewed_at: null,
          reviewed_by: null,
          news_id: null,
        }}
        onReviewed={onReviewed}
      />,
    );

    const approve = screen.getByRole('button', { name: 'Setujui dan terbitkan' });
    expect(approve.hasAttribute('disabled')).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(approve);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body)).toMatchObject({
      action: 'approve',
      candidateId: 'c9344ab5-bccb-4214-8e2e-218a81d625bc',
      sourceConfirmed: true,
    });
    await waitFor(() => expect(onReviewed).toHaveBeenCalledOnce());
  });
});
