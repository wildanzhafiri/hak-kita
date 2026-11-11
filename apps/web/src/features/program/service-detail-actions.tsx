import { OfficialSiteLink } from '@/components/program/official-site-link';
import { SaveButton } from '@/components/program/save-button';
import { SERVICE_DETAIL_CONTENT } from './content';
import type { DetailProgramSectionProps } from './types';

export function ServiceDetailActions({ program }: DetailProgramSectionProps) {
  return (
    <aside
      aria-label={SERVICE_DETAIL_CONTENT.actionTitle}
      className="mb-9 mt-1 flex min-w-0 flex-wrap items-center justify-between gap-6 rounded-xl border border-[#bccfe3] bg-[#f5f8fc] px-[22px] py-5 shadow-[0_3px_10px_rgba(35,59,85,0.075)] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-4 max-[640px]:p-[18px]"
    >
      <div className="min-w-0 flex-[1_1_280px]">
        <h2 className="mb-1.5 mt-0 text-lg font-semibold leading-[1.4] tracking-normal text-[#1b304c]">
          {SERVICE_DETAIL_CONTENT.actionTitle}
        </h2>
        <p className="m-0 text-sm leading-[1.6] text-[#617087]">
          {SERVICE_DETAIL_CONTENT.actionDescription}
        </p>
      </div>
      <div className="flex min-w-0 flex-[1_1_300px] flex-wrap items-center justify-end gap-2.5 max-[640px]:flex-col max-[640px]:items-stretch">
        <OfficialSiteLink
          className="button flex min-h-11 items-center justify-center gap-2 text-center text-sm max-[640px]:w-full"
          label={SERVICE_DETAIL_CONTENT.actionLabel}
          url={program.sumberUtama.url}
        />
        <div className="min-w-[190px] max-[640px]:w-full">
          <SaveButton program={program} variant="button" />
        </div>
      </div>
    </aside>
  );
}
