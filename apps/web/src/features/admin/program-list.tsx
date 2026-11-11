'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { JENIS_PROGRAM } from '@hakkita/schema';
import { ButtonLink } from '@/components/ui/button-link';
import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import { ResultPagination } from '@/features/program/result-pagination';
import { ADMIN_KIND_FILTER_OPTIONS, ADMIN_PAGE_SIZE } from './constants';
import { PROGRAM_ADMIN_COPY } from './content';
import type { ProgramKindFilter, ProgramListProps } from './types';
import { ProgramAdminRow } from './program-admin-row';

export function ProgramList({ programs, canManage = false }: ProgramListProps) {
  const [query, setQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<ProgramKindFilter>('all');
  const [page, setPage] = useState(1);
  const searchTerm = query.trim().toLocaleLowerCase('id');
  const visiblePrograms = programs.filter((program) => {
    const matchesSearch = `${program.nama} ${program.penyelenggara} ${program.kategori}`
      .toLocaleLowerCase('id')
      .includes(searchTerm);
    const matchesKind = kindFilter === 'all' || program.jenis === kindFilter;
    return matchesSearch && matchesKind;
  });
  const pageCount = Math.max(1, Math.ceil(visiblePrograms.length / ADMIN_PAGE_SIZE));
  const visiblePage = Math.min(page, pageCount);
  const pagePrograms = visiblePrograms.slice(
    (visiblePage - 1) * ADMIN_PAGE_SIZE,
    visiblePage * ADMIN_PAGE_SIZE,
  );
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {canManage ? (
          <ButtonLink href="/admin/informasi/tambah" icon={<Plus aria-hidden="true" size={17} />}>
            {PROGRAM_ADMIN_COPY.createAction}
          </ButtonLink>
        ) : (
          <p className="text-sm text-[#64748b]">{PROGRAM_ADMIN_COPY.storageUnavailable}</p>
        )}
      </div>
      <section className="overflow-hidden rounded-xl border border-[#e1e9f2] bg-white">
        <div className="[display:grid] grid-cols-1 gap-3 border-b border-[#e1e9f2] p-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:p-5">
          <label className="relative block min-w-0">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]"
              size={18}
            />
            <TextInput
              aria-label={PROGRAM_ADMIN_COPY.searchLabel}
              className="pl-10"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={PROGRAM_ADMIN_COPY.searchPlaceholder}
              type="search"
              value={query}
            />
          </label>
          <SelectField
            label="Jenis"
            onChange={(value) => {
              setPage(1);
              if (value === 'all') {
                setKindFilter(value);
                return;
              }
              const selectedKind = JENIS_PROGRAM.find((kind) => kind === value);
              if (selectedKind) setKindFilter(selectedKind);
            }}
            options={ADMIN_KIND_FILTER_OPTIONS}
            placeholder="Semua jenis"
            value={kindFilter}
          />
        </div>

        {visiblePrograms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1240px] border-collapse text-left text-[13px]">
              <thead className="bg-[#f9fbfd] text-xs font-semibold text-[#64748b]">
                <tr>
                  <th className="min-w-[260px] px-4 py-3" scope="col">
                    Program &amp; Layanan
                  </th>
                  <th className="min-w-[210px] px-4 py-3" scope="col">
                    Jenis
                  </th>
                  <th className="min-w-[250px] px-4 py-3" scope="col">
                    Instansi
                  </th>
                  <th className="min-w-[290px] px-4 py-3" scope="col">
                    Terakhir diperbarui
                  </th>
                  <th className="w-[150px] whitespace-nowrap px-4 py-3" scope="col">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagePrograms.map((program) => (
                  <ProgramAdminRow key={program.id} program={program} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-base font-semibold text-[#253044]">
              {searchTerm ? PROGRAM_ADMIN_COPY.emptySearch : PROGRAM_ADMIN_COPY.emptyAll}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64748b]">
              {searchTerm
                ? 'Coba kata kunci lain atau tampilkan semua informasi.'
                : 'Informasi program dan layanan akan ditampilkan di sini.'}
            </p>
          </div>
        )}
        {pageCount > 1 && (
          <div className="border-t border-[#e1e9f2] px-4 pb-5">
            <ResultPagination
              ariaLabel="Halaman daftar informasi"
              onPageChange={setPage}
              page={visiblePage}
              pageCount={pageCount}
            />
          </div>
        )}
      </section>
    </div>
  );
}
