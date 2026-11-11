import Link from 'next/link';
import { PROGRAM_ADMIN_COPY } from './content';
import { ProgramKindBadge } from './program-kind-badge';
import type { ProgramRowProps } from './types';

export function ProgramAdminRow({ program }: ProgramRowProps) {
  const updatedDate = program.tanggalDiperiksa
    ? PROGRAM_ADMIN_COPY.sourceChecked(
        new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        }).format(new Date(`${program.tanggalDiperiksa}T00:00:00Z`)),
      )
    : PROGRAM_ADMIN_COPY.noUpdateDate;
  const detailLink = (
    <Link
      className="inline-flex min-h-10 items-center gap-2 font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
      href={`/admin/informasi/${program.id}`}
    >
      {PROGRAM_ADMIN_COPY.detailAction}
    </Link>
  );

  return (
    <tr className="border-b border-[#e8eef5] last:border-b-0">
      <td className="px-4 py-4 align-middle text-sm font-semibold text-[#253044]">
        {program.nama}
      </td>
      <td className="px-4 py-4 align-middle">
        <ProgramKindBadge kind={program.jenis} />
      </td>
      <td className="px-4 py-4 align-middle text-[13px] text-[#475569]">{program.penyelenggara}</td>
      <td className="whitespace-nowrap px-4 py-4 align-middle text-[13px] text-[#64748b]">
        {updatedDate}
      </td>
      <td className="w-[150px] whitespace-nowrap px-4 py-4 align-middle">{detailLink}</td>
    </tr>
  );
}
