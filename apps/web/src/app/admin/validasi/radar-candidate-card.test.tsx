import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { RadarCandidateCard } from './radar-candidate-card';

const candidate = {
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
  status: 'pending' as const,
  detected_at: '2026-11-10T03:00:00Z',
  reviewed_at: null,
  reviewed_by: null,
  news_id: null,
};

afterEach(() => vi.unstubAllGlobals());

describe('RadarCandidateCard', () => {
  it('shows the draft and its source evidence before anything is edited', () => {
    render(<RadarCandidateCard candidate={candidate} onReviewed={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Ringkasan perubahan' })).toBeTruthy();
    expect(screen.getByText('Pendaftaran KIP Kuliah dibuka')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sumber Informasi' })).toBeTruthy();
    expect(screen.getByText(/Pendaftaran baru dibuka untuk calon mahasiswa/)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Buka sumber resmi/ }).getAttribute('href')).toBe(
      'https://kip-kuliah.kemdiktisaintek.go.id/panduan',
    );
  });

  it('requires the source check and a confirmation before publishing', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    const onReviewed = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<RadarCandidateCard candidate={candidate} onReviewed={onReviewed} />);

    const approve = screen.getByRole('button', { name: 'Setujui & Publikasikan' });
    expect(approve.hasAttribute('disabled')).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(approve);
    expect(fetchMock).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole('button', { name: 'Ya, publikasikan' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body)).toMatchObject({
      action: 'approve',
      candidateId: candidate.id,
      sourceConfirmed: true,
    });
    await waitFor(() => expect(onReviewed).toHaveBeenCalledOnce());
  });

  it('lets the admin correct the draft and then asks for the check again', () => {
    render(<RadarCandidateCard candidate={candidate} onReviewed={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Perbaiki' }));
    fireEvent.change(screen.getByDisplayValue('Pendaftaran KIP Kuliah dibuka'), {
      target: { value: 'Pendaftaran KIP Kuliah 2027 dibuka' },
    });
    fireEvent.change(screen.getByLabelText(/Sumber resmi tambahan/), {
      target: { value: 'https://kip-kuliah.kemdiktisaintek.go.id/syarat' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Simpan perbaikan' }));

    expect(screen.getByText('Pendaftaran KIP Kuliah 2027 dibuka')).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /Buka sumber resmi/ })).toHaveLength(2);
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
    expect(
      screen.getByRole('button', { name: 'Setujui & Publikasikan' }).hasAttribute('disabled'),
    ).toBe(true);
  });
});

describe('RadarCandidateCard program context', () => {
  it('offers the current program information in a dropdown when it is known', () => {
    render(
      <RadarCandidateCard
        candidate={candidate}
        onReviewed={vi.fn()}
        program={makeProgram({ nama: 'KIP Kuliah', biaya: undefined })}
        regionName="Nasional"
      />,
    );

    const details = screen.getByText('Lihat keseluruhan informasi').closest('details');
    expect(details?.textContent).toContain('Nasional');
    expect(details?.textContent).toContain('Persyaratan');
  });

  it('leaves the dropdown out when the program is unknown', () => {
    render(<RadarCandidateCard candidate={candidate} onReviewed={vi.fn()} />);

    expect(screen.queryByText('Lihat keseluruhan informasi')).toBeNull();
  });
});
