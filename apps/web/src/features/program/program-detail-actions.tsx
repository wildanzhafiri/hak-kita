import { Bell, ExternalLink } from 'lucide-react';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { SaveButton } from '@/components/program/save-button';
import { FollowProgramButton } from './follow-program-button';
import type { DetailProgramSectionProps } from './types';

export function ProgramDetailActions({ program }: DetailProgramSectionProps) {
  return (
    <aside
      className="my-9 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"
      aria-label="Akses dan pembaruan program"
    >
      <section className="flex min-w-0 flex-col rounded-xl border border-[#dbe5ef] bg-white p-4 shadow-[0_3px_10px_rgba(35,59,85,0.075)] sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf5ff] text-[#1769c2]">
            <ExternalLink aria-hidden="true" size={18} />
          </span>
          <h2 className="m-0 text-base font-semibold text-[#1b304c]">Akses Program Resmi</h2>
        </div>
        <p className="mb-5 mt-4 text-sm leading-[1.7] text-[#617087]">
          Periksa informasi terbaru melalui kanal resmi penyelenggara program.
        </p>
        <OfficialSiteLink
          className="button mt-auto flex min-h-11 w-full items-center justify-center gap-2 text-center text-sm"
          label="Lihat informasi resmi"
          url={program.sumberUtama.url}
        />
      </section>
      <section className="min-w-0 rounded-xl border border-[#f1dfc4] bg-[#fffaf1] p-4 shadow-[0_3px_10px_rgba(35,59,85,0.075)] sm:p-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf5ff] text-[#1769c2]">
            <Bell aria-hidden="true" size={18} />
          </span>
          <h2 className="m-0 text-base font-semibold text-[#1b304c]">Dapatkan Informasi Terbaru</h2>
        </div>
        <p className="mb-4 mt-4 text-sm leading-[1.7] text-[#617087]">
          Simpan program ini agar mudah ditemukan kembali, atau dapatkan pembaruan melalui email.
        </p>
        <FollowProgramButton
          program={program}
          showDescription={false}
          actionLabel="Dapatkan pengingat email"
          actionTone="primary"
        />
        <div className="mt-2">
          <SaveButton program={program} variant="button" />
        </div>
      </section>
    </aside>
  );
}
