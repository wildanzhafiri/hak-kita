import type { RadarSkipReason } from '@hakkita/schema';
import { SECONDS_PER_MINUTE } from './constants';
import { RADAR_RUN_COPY, RADAR_RUN_KIND_LABELS, RADAR_SKIP_REASON_COPY } from './content';
import type { RadarRunState } from './types';

export function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatSkipReason(
  reason: RadarSkipReason,
  name: string | null,
  detail?: string,
): string {
  const text = detail
    ? `${RADAR_SKIP_REASON_COPY[reason]} ${detail}`
    : RADAR_SKIP_REASON_COPY[reason];
  return name ? `${name}: ${text}` : text;
}

export function formatSearchedNote(found: number, usedRegisteredSources: boolean): string {
  return usedRegisteredSources
    ? `Pencarian web tidak tersedia. Memakai ${found} sumber resmi yang sudah terdaftar.`
    : `Menemukan ${found} halaman .go.id.`;
}

export function formatReadNote(readable: number): string {
  return readable > 0
    ? `${readable} halaman berhasil dibaca.`
    : 'Tidak ada halaman yang bisa dibaca.';
}

export function formatSourcesNote(count: number): string {
  return count > 0 ? `Membaca ${count} sumber, lalu menyerahkan hasilnya.` : 'Hasil diserahkan.';
}

export function formatProgressLabel(state: RadarRunState): string {
  const { done, total } = state.progress;
  if (state.kind === 'monitoring')
    return `${done} dari ${total} ${RADAR_RUN_KIND_LABELS.monitoring}`;
  const position = Math.min(state.round ? state.round.index + 1 : done + 1, total);
  const label = state.round ? `: ${state.round.label}` : '';
  return `${RADAR_RUN_KIND_LABELS.discovery} ${position} dari ${total}${label}`;
}

function formatStoppedHeadline(state: RadarRunState): string {
  const { done, total } = state.progress;
  if (state.kind === 'monitoring') return `Dihentikan setelah ${done} dari ${total} sumber`;
  const position = Math.min(state.round ? state.round.index + 1 : 1, total);
  return `Dihentikan di putaran ${position} dari ${total}`;
}

export function readRunTitle(state: RadarRunState): string {
  return RADAR_RUN_COPY.titles[state.kind][state.status];
}

export function readRunHeadline(state: RadarRunState): { headline: string; detail: string } {
  if (state.status === 'failed') {
    return {
      headline: state.failure ?? RADAR_RUN_COPY.requestFailedMessage,
      detail: RADAR_RUN_COPY.failedDetail,
    };
  }
  if (state.status === 'stopped') {
    return {
      headline: formatStoppedHeadline(state),
      detail: RADAR_RUN_COPY.stopDetail[state.kind],
    };
  }
  if (state.status === 'done') {
    const noFindings =
      state.kind === 'discovery' ? RADAR_RUN_COPY.noFindingsHint : RADAR_RUN_COPY.noChangesHint;
    return {
      headline: state.summary ?? readRunTitle(state),
      detail: state.tally.flagged > 0 ? RADAR_RUN_COPY.reloadHint : noFindings,
    };
  }
  if (state.kind === 'monitoring') {
    const monitor = RADAR_RUN_COPY.agents.monitor;
    return { headline: monitor.headline, detail: state.currentSource ?? monitor.detail };
  }
  if (!state.phase) {
    return { headline: RADAR_RUN_COPY.starting, detail: RADAR_RUN_COPY.startingDetail };
  }
  const agent = RADAR_RUN_COPY.agents[state.phase];
  const isReadingSource = state.phase === 'draft' && state.currentSource;
  return {
    headline: agent.headline,
    detail: isReadingSource ? `Sedang membaca ${state.currentSource}.` : agent.detail,
  };
}
