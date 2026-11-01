'use client';

import { Building2, FileCheck, MapPin, UsersRound } from 'lucide-react';
import { isLayanan } from '@hakkita/domain';
import { KATEGORI_STYLE } from '@/components/program/constants';
import { DataNote } from '@/components/ui/data-note';
import { GERBANG_LABEL } from './constants';
import { DetailSidebar } from './detail-sidebar';
import { DetailRequirementsSection } from './detail-requirements-section';
import { DetailStepsSection } from './detail-steps-section';
import type { ProgramDetailProps } from './types';

export function ProgramDetail({ program, namaCakupan }: ProgramDetailProps) {
  const { icon: CategoryIcon } = KATEGORI_STYLE[program.kategori];

  return (
    <div className="grid grid-cols-1 items-start gap-x-11 gap-y-6 lg:grid-cols-[minmax(0,2.3fr)_minmax(280px,1fr)]">
      <header className="order-0 min-w-0 border-b border-[#e1e7ee] pb-6 lg:col-span-2">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_64px] items-start gap-4 sm:grid-cols-[minmax(0,1fr)_104px] sm:gap-10">
          <div className="min-w-0">
            <span className="mb-4 inline-flex rounded-full bg-[#edf5ff] px-2.5 py-1 text-[13px] font-medium text-[#1769c2]">
              {program.kategori}
            </span>
            <h1 className="m-0 text-[32px] font-bold leading-[1.23] tracking-[-0.025em] text-[#1b304c] [overflow-wrap:anywhere] sm:text-[36px]">
              {program.nama}
            </h1>
            <p className="mt-[18px] max-w-[70ch] text-[15px] leading-[1.7] text-[#617087] sm:text-base">
              {program.ringkasan}
            </p>
          </div>
          <span className="grid size-16 place-items-center rounded-xl border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2] sm:size-[104px]">
            <CategoryIcon className="size-8 sm:size-12" strokeWidth={1.5} />
          </span>
        </div>
      </header>

      <dl className="order-2 grid min-w-0 grid-cols-1 gap-x-6 gap-y-[18px] border-b border-[#e1e7ee] pb-7 sm:grid-cols-2 lg:order-1 lg:border-b-0 lg:pb-0">
        <div className="relative min-h-11 min-w-0 pl-14">
          <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-[10px] border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2]">
            <UsersRound size={22} />
          </span>
          <dt className="mb-1 text-xs text-[#687385]">Untuk siapa</dt>
          <dd className="m-0 text-sm leading-[1.6] text-[#1b304c]">{program.untuk.join(', ')}</dd>
        </div>
        <div className="relative min-h-11 min-w-0 pl-14">
          <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-[10px] border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2]">
            <Building2 size={22} />
          </span>
          <dt className="mb-1 text-xs text-[#687385]">Penyelenggara</dt>
          <dd className="m-0 text-sm leading-[1.6] text-[#1b304c]">{program.penyelenggara}</dd>
        </div>
        <div className="relative min-h-11 min-w-0 pl-14">
          <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-[10px] border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2]">
            <MapPin size={22} />
          </span>
          <dt className="mb-1 text-xs text-[#687385]">Cakupan wilayah</dt>
          <dd className="m-0 text-sm leading-[1.6] text-[#1b304c]">{namaCakupan}</dd>
        </div>
        <div className="relative min-h-11 min-w-0 pl-14 sm:col-span-2">
          <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-[10px] border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2]">
            <FileCheck size={22} />
          </span>
          <dt className="mb-1 text-xs text-[#687385]">
            {isLayanan(program) ? 'Jenis pengurusan' : 'Penentuan penerima'}
          </dt>
          <dd className="m-0 text-sm leading-[1.6] text-[#1b304c]">
            {GERBANG_LABEL[program.tipeGerbang]}
          </dd>
        </div>
      </dl>

      <div className="order-1 min-w-0 lg:order-2 lg:col-start-2 lg:row-start-2 lg:row-span-2">
        <DetailSidebar program={program} />
      </div>

      <div className="order-3 min-w-0 lg:col-start-1 lg:row-start-3">
        <DataNote>Periksa ketentuan terbaru melalui kanal resmi sebelum mengajukan.</DataNote>
        <div className="mt-6 divide-y divide-[#e1e7ee] rounded-2xl border border-[#e1e7ee] bg-white px-6 sm:px-8">
          <DetailRequirementsSection program={program} />
          <DetailStepsSection program={program} />
        </div>
      </div>
    </div>
  );
}
