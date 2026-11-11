'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleCheck, Search } from 'lucide-react';
import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import { ADMIN_KIND_FILTER_OPTIONS } from '@/features/admin/constants';
import { ProgramKindBadge } from '@/features/admin/program-kind-badge';
import { ResultPagination } from '@/features/program/result-pagination';
import { VALIDATION_PAGE_SIZE } from './constants';
import { VALIDATION_COPY } from './content';
import { formatFoundAt } from './format-found-at';
import type { ValidationFinding, ValidationItem, ValidationQueueProps } from './types';

const FINDING_OPTIONS = [
  { value: 'all', label: VALIDATION_COPY.allFindings },
  { value: 'new', label: VALIDATION_COPY.findings.new },
  { value: 'update', label: VALIDATION_COPY.findings.update },
];

const KIND_OPTIONS = ADMIN_KIND_FILTER_OPTIONS.map((option) =>
  option.value === 'all' ? { ...option, label: VALIDATION_COPY.allKinds } : option,
);

function matchesFilters(
  item: ValidationItem,
  term: string,
  kind: string,
  finding: ValidationFinding | 'all',
) {
  return (
    item.name.toLocaleLowerCase('id').includes(term) &&
    (kind === 'all' || item.kind === kind) &&
    (finding === 'all' || item.finding === finding)
  );
}

export function ValidationQueue({ items }: ValidationQueueProps) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [finding, setFinding] = useState<ValidationFinding | 'all'>('all');
  const [page, setPage] = useState(1);

  const term = query.trim().toLocaleLowerCase('id');
  const visible = items.filter((item) => matchesFilters(item, term, kind, finding));
  const pageCount = Math.max(1, Math.ceil(visible.length / VALIDATION_PAGE_SIZE));
  const visiblePage = Math.min(page, pageCount);
  const rows = visible.slice(
    (visiblePage - 1) * VALIDATION_PAGE_SIZE,
    visiblePage * VALIDATION_PAGE_SIZE,
  );
  const columns = VALIDATION_COPY.columns;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-[#e1e9f2] bg-white px-5 py-14 text-center">
        <CircleCheck aria-hidden="true" className="text-[#196dcc]" size={34} />
        <h2 className="mt-3 text-lg font-semibold text-[#253044]">{VALIDATION_COPY.emptyTitle}</h2>
        <p className="mt-1.5 max-w-md text-sm leading-6 text-[#64748b]">
          {VALIDATION_COPY.emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#e1e9f2] bg-white">
      <div className="[display:grid] grid-cols-1 gap-3 border-b border-[#e1e9f2] p-4 sm:grid-cols-[minmax(0,1fr)_190px_190px] sm:p-5">
        <label className="relative block min-w-0">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]"
            size={18}
          />
          <TextInput
            aria-label={VALIDATION_COPY.searchLabel}
            className="pl-10"
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={VALIDATION_COPY.searchLabel}
            type="search"
            value={query}
          />
        </label>
        <SelectField
          label={VALIDATION_COPY.kindLabel}
          onChange={(value) => {
            setKind(value);
            setPage(1);
          }}
          options={KIND_OPTIONS}
          placeholder={VALIDATION_COPY.allKinds}
          value={kind}
        />
        <SelectField
          label={VALIDATION_COPY.findingLabel}
          onChange={(value) => {
            setFinding(value === 'new' || value === 'update' ? value : 'all');
            setPage(1);
          }}
          options={FINDING_OPTIONS}
          placeholder={VALIDATION_COPY.allFindings}
          value={finding}
        />
      </div>
      {visible.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-base font-semibold text-[#253044]">{VALIDATION_COPY.noResultsTitle}</p>
          <p className="mt-2 text-sm text-[#64748b]">{VALIDATION_COPY.noResultsDescription}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-[13px] leading-[1.55]">
            <thead className="bg-[#f9fbfd] text-xs font-semibold text-[#64748b]">
              <tr>
                <th className="w-[23%] px-4 py-3" scope="col">
                  {columns.name}
                </th>
                <th className="px-4 py-3" scope="col">
                  {columns.kind}
                </th>
                <th className="px-4 py-3" scope="col">
                  {columns.finding}
                </th>
                <th className="min-w-[260px] px-4 py-3" scope="col">
                  {columns.summary}
                </th>
                <th className="whitespace-nowrap px-4 py-3" scope="col">
                  {columns.foundAt}
                </th>
                <th className="w-[110px] px-4 py-3" scope="col">
                  {columns.action}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr
                  className="border-t border-[#e8eef5] align-middle hover:bg-[#fbfdff]"
                  key={item.id}
                >
                  <td className="px-4 py-4 font-semibold text-[#253044]">{item.name}</td>
                  <td className="px-4 py-4">
                    <ProgramKindBadge kind={item.kind} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex min-h-8 items-center whitespace-nowrap rounded-full border border-[#d6e5f5] bg-[#eef5fc] px-3 text-xs font-semibold text-[#196dcc]">
                      {VALIDATION_COPY.findings[item.finding]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#475569]">
                    <span className="line-clamp-2">{item.summary}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#64748b]">
                    {formatFoundAt(item.detectedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      className="inline-flex min-h-10 items-center font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
                      href={`/admin/validasi/${item.id}`}
                    >
                      {VALIDATION_COPY.review}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pageCount > 1 && (
        <div className="border-t border-[#e1e9f2] px-4 pb-5">
          <ResultPagination
            ariaLabel={VALIDATION_COPY.pagination}
            onPageChange={setPage}
            page={visiblePage}
            pageCount={pageCount}
          />
        </div>
      )}
    </section>
  );
}
