import { Building2, Gift, GraduationCap, MapPin } from 'lucide-react';
import type { ProgramDetailProps } from './types';

export function ProgramDetailMetadata({ program, namaCakupan }: ProgramDetailProps) {
  const entries = [
    { label: 'Bidang', value: program.kategori, icon: GraduationCap },
    {
      label: 'Bentuk bantuan',
      value: program.manfaat?.join(', ') || 'Mengikuti ketentuan program',
      icon: Gift,
    },
    { label: 'Cakupan wilayah', value: namaCakupan, icon: MapPin },
    { label: 'Penyelenggara', value: program.penyelenggara, icon: Building2 },
  ];

  return (
    <dl className="mb-14 grid min-w-0 grid-cols-1 gap-x-6 gap-y-[18px] sm:grid-cols-2 max-[640px]:mb-7">
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
