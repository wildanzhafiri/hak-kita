import { ExternalLink } from 'lucide-react';
import { RADAR_HISTORY_COPY } from './content';
import type { RadarHistoryProps } from './types';

function formatReviewDate(value: string | null) {
  if (!value) return 'Waktu belum tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value));
}

export function RadarHistory({ candidates }: RadarHistoryProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#e1e9f2] bg-white">
      {candidates.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-[#f9fbfd] text-xs font-semibold text-[#64748b]">
              <tr>
                <th className="px-5 py-3" scope="col">
                  Program
                </th>
                <th className="px-5 py-3" scope="col">
                  Temuan
                </th>
                <th className="px-5 py-3" scope="col">
                  Keputusan
                </th>
                <th className="px-5 py-3" scope="col">
                  Waktu ditinjau
                </th>
                <th className="px-5 py-3" scope="col">
                  Sumber
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr className="border-t border-[#e8eef5]" key={candidate.id}>
                  <td className="px-5 py-4 font-medium text-[#253044]">{candidate.program_name}</td>
                  <td className="max-w-[32ch] px-5 py-4 text-[#475569]">
                    {candidate.draft_title ?? 'Temuan Radar'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        candidate.status === 'approved'
                          ? 'inline-flex rounded-md border border-[#b8e1cc] bg-[#edf8f1] px-2.5 py-1 text-xs font-semibold text-[#226b43]'
                          : 'inline-flex rounded-md border border-[#f1cdcd] bg-[#fff2f2] px-2.5 py-1 text-xs font-semibold text-[#a32e2e]'
                      }
                    >
                      {candidate.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[#64748b]">
                    {formatReviewDate(candidate.reviewed_at)} WIB
                  </td>
                  <td className="px-5 py-4">
                    <a
                      aria-label={`Buka sumber ${candidate.program_name}`}
                      className="inline-flex min-h-10 items-center gap-2 font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
                      href={candidate.source_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Sumber <ExternalLink aria-hidden="true" size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-12 text-center">
          <p className="text-base font-semibold text-[#253044]">{RADAR_HISTORY_COPY.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64748b]">
            {RADAR_HISTORY_COPY.emptyDescription}
          </p>
        </div>
      )}
    </section>
  );
}
