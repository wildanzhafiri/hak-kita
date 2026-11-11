'use client';

import { useState } from 'react';
import type { RadarReviewRequest } from '@hakkita/schema';
import type { RadarCandidateCardProps } from './types';

export function useRadarCandidateReview({ candidate, onReviewed }: RadarCandidateCardProps) {
  const [title, setTitle] = useState(candidate.draft_title ?? '');
  const [summary, setSummary] = useState(candidate.draft_summary ?? '');
  const [emailText, setEmailText] = useState(candidate.draft_email_text ?? '');
  const [publishedOn, setPublishedOn] = useState(candidate.published_on ?? '');
  const [extraSources, setExtraSources] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitReview(review: RadarReviewRequest) {
    setError(null);
    setIsBusy(true);
    try {
      const response = await fetch('/api/admin/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (!response.ok) {
        setError(
          'Tinjauan belum tersimpan. Periksa isian dan muat ulang bila temuan sudah ditinjau.',
        );
        return;
      }
      const result: unknown = await response.json();
      const newsId =
        result &&
        typeof result === 'object' &&
        'newsId' in result &&
        typeof result.newsId === 'string'
          ? result.newsId
          : undefined;
      onReviewed(candidate.id, newsId);
    } catch {
      setError('Koneksi terputus. Coba simpan tinjauan lagi.');
    } finally {
      setIsBusy(false);
      setIsRejectOpen(false);
    }
  }

  function approve() {
    if (!isConfirmed || isBusy) return;
    void submitReview({
      action: 'approve',
      candidateId: candidate.id,
      title,
      summary,
      publishedOn,
      emailText,
      extraSourceUrls: extraSources
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean),
      sourceConfirmed: true,
    });
  }

  function rejectCandidate() {
    if (isBusy) return;
    void submitReview({ action: 'reject', candidateId: candidate.id });
  }

  return {
    title,
    setTitle,
    summary,
    setSummary,
    emailText,
    setEmailText,
    publishedOn,
    setPublishedOn,
    extraSources,
    setExtraSources,
    isConfirmed,
    setIsConfirmed,
    isRejectOpen,
    setIsRejectOpen,
    isBusy,
    error,
    approve,
    rejectCandidate,
  };
}
