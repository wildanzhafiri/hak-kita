import { KATEGORI_STYLE } from '@/components/program/constants';
import type { ServiceDetailProps } from './types';

export function ServiceDetailHeader({ program }: Pick<ServiceDetailProps, 'program'>) {
  const { icon: CategoryIcon } = KATEGORI_STYLE[program.kategori];

  return (
    <header className="mb-[22px] min-w-0 max-[640px]:mb-[18px]">
      <div className="flex min-w-0 items-start justify-between gap-6 max-[640px]:gap-4">
        <div className="min-w-0">
          <span className="mb-4 inline-block rounded-full bg-[#edf5ff] px-2.5 py-1 text-[13px] font-medium text-[#1769c2]">
            {program.kategori}
          </span>
          <h1 className="m-0 text-[32px] font-bold leading-[1.23] tracking-[-0.025em] text-[#1b304c] [overflow-wrap:anywhere] max-[640px]:text-[26px]">
            {program.nama}
          </h1>
          <p className="mb-0 mt-[18px] text-base leading-[1.7] text-[#617087] max-[640px]:text-[15px]">
            {program.ringkasan}
          </p>
        </div>
        <span className="grid size-[68px] shrink-0 place-items-center rounded-xl border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2] max-[640px]:size-[54px]">
          <CategoryIcon aria-hidden="true" className="size-[38px] max-[640px]:size-[30px]" strokeWidth={1.5} />
        </span>
      </div>
    </header>
  );
}
