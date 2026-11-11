import { formatDate } from '@hakkita/domain';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function DetailPeriodSection({ program }: DetailProgramSectionProps) {
  return (
    <DetailSection id="periode" title="Periode Pendaftaran" variant="program">
      {program.periode === 'sepanjang-tahun' ? (
        <p className="text-sm leading-[1.7] text-[var(--text)]">
          Pendaftaran berlangsung sepanjang tahun. Periksa kanal resmi untuk ketentuan terbaru.
        </p>
      ) : program.periode ? (
        <div className="border-b border-[#e1e7ee] py-[14px] text-[15px] leading-[1.7] text-[#536477]">
          <strong className="block font-semibold text-[#1b304c]">Periode yang tercatat</strong>
          <span>
            {formatDate(program.periode.buka)} – {formatDate(program.periode.tutup)}
          </span>
          <a
            className="mt-1 block w-fit text-[13px] text-[#1769c2] hover:underline"
            href={program.sumberUtama.url}
            rel="noreferrer"
            target="_blank"
          >
            Periksa jadwal resmi
          </a>
        </div>
      ) : (
        <p className="text-sm leading-[1.7] text-[var(--muted)]">
          Jadwal pendaftaran belum dicantumkan. Periksa pengumuman resmi penyelenggara.
        </p>
      )}
      {program.catatan && (
        <p className="mt-4 text-[15px] leading-[1.7] text-[#536477]">{program.catatan}</p>
      )}
    </DetailSection>
  );
}
