import Link from 'next/link';
import { FileCheck } from 'lucide-react';
import { berkasPath, hostnameOf } from '@hakkita/domain';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { SaveButton } from '@/components/program/save-button';
import type { DetailSidebarProps } from './types';

export function DetailSidebar({ program }: DetailSidebarProps) {
  const host = hostnameOf(program.sumberUtama.url) ?? program.sumberUtama.url;

  return (
    <aside className="min-w-0 rounded-2xl border border-[#dbe5ef] bg-[#f5f8fc] p-6 lg:sticky lg:top-6 max-[1000px]:p-5">
      <span className="inline-flex rounded-full border border-[#c7dbf2] bg-white px-2.5 py-1 text-xs text-[#1769c2]">
        {program.kategori}
      </span>
      <h2 className="mb-0 mt-4 text-xl font-semibold leading-[1.4] tracking-normal text-[#1b304c]">
        Lanjutkan pengurusan
      </h2>
      <p className="mb-5 mt-2 text-sm leading-[1.7] text-[#617087]">
        Baca syarat dan langkahnya, lalu buka kanal resmi penyelenggara.
      </p>
      {program.berkas && (
        <Link className="button full" href={berkasPath(program)}>
          Siapkan berkasmu <FileCheck size={17} />
        </Link>
      )}
      <OfficialSiteLink
        url={program.sumberUtama.url}
        className={program.berkas ? 'button secondary full' : 'button full'}
      />
      <SaveButton program={program} variant="button" />
      <small className="mt-5 block border-t border-[#dbe5ef] pt-4 text-xs leading-5 text-[#617087]">
        Sumber: {host}. HAKKITA tidak mengajukan permohonan atas namamu.
      </small>
    </aside>
  );
}
