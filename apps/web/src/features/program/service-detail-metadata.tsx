import { Building2, FileCheck, MapPin, UsersRound } from 'lucide-react';
import { GERBANG_LABEL } from './constants';
import { SERVICE_DETAIL_CONTENT } from './content';
import type { ServiceDetailProps } from './types';

export function ServiceDetailMetadata({
  program,
  namaCakupan,
}: Pick<ServiceDetailProps, 'program' | 'namaCakupan'>) {
  const entries = [
    { label: SERVICE_DETAIL_CONTENT.audience, value: program.untuk.join(', '), icon: UsersRound },
    { label: SERVICE_DETAIL_CONTENT.provider, value: program.penyelenggara, icon: Building2 },
    { label: SERVICE_DETAIL_CONTENT.coverage, value: namaCakupan, icon: MapPin },
    { label: SERVICE_DETAIL_CONTENT.kind, value: GERBANG_LABEL[program.tipeGerbang], icon: FileCheck },
  ];

  return (
    <dl className="mb-10 grid min-w-0 grid-cols-1 gap-x-6 gap-y-[18px] sm:grid-cols-2 max-[640px]:mb-7">
      {entries.map(({ label, value, icon: Icon }) => (
        <div className="relative min-h-11 min-w-0 pl-14" key={label}>
          <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-[10px] border border-[#dbe8f7] bg-[#edf5ff] text-[#1769c2]">
            <Icon aria-hidden="true" size={22} strokeWidth={1.7} />
          </span>
          <dt className="mb-[5px] text-xs text-[#687385]">{label}</dt>
          <dd className="m-0 min-w-0 break-words text-sm leading-[1.6] text-[#1b304c]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
