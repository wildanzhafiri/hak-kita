import { ExternalLink } from 'lucide-react';
import { formatDate, hostnameOf } from '@hakkita/domain';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function DetailSourcesSection({ program }: DetailProgramSectionProps) {
  const sources = [
    { label: 'Sumber utama', source: program.sumberUtama },
    ...program.sumberTambahan.map((source, index) => ({
      label: `Sumber tambahan ${index + 1}`,
      source,
    })),
  ];

  return (
    <DetailSection id="sumber" title="Sumber Informasi" variant="program">
      <p className="mb-4 text-[15px] leading-[1.7] text-[#536477]">{program.penyelenggara}</p>
      <ul className="divide-y divide-[var(--border)]">
        {sources.map(({ label, source }) => (
          <li className="py-3 first:pt-0 last:pb-0" key={source.url}>
            <a
              className="inline-flex max-w-full items-start gap-2 text-sm font-semibold leading-6 text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              href={source.url}
              rel="noreferrer"
              target="_blank"
            >
              <span className="break-all">
                {label}: {hostnameOf(source.url) ?? source.url}
              </span>
              <ExternalLink aria-hidden="true" className="mt-1 shrink-0" size={15} />
            </a>
          </li>
        ))}
      </ul>
      {program.tanggalDiperiksa && (
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          Rujukan terakhir diperiksa {formatDate(program.tanggalDiperiksa)}.
        </p>
      )}
    </DetailSection>
  );
}
