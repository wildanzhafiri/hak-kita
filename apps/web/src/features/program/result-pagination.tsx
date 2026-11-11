'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { RESULT_PAGINATION_FULL_PAGE_LIMIT, RESULT_PAGINATION_SIBLING_COUNT } from './constants';
import type { ResultPaginationProps } from './types';

type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPaginationItems(page: number, pageCount: number): PaginationItem[] {
  if (pageCount <= RESULT_PAGINATION_FULL_PAGE_LIMIT) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  let start = Math.max(2, page - RESULT_PAGINATION_SIBLING_COUNT);
  let end = Math.min(pageCount - 1, page + RESULT_PAGINATION_SIBLING_COUNT);

  if (page <= 2) end = Math.min(pageCount - 1, 3);
  if (page >= pageCount - 1) start = Math.max(2, pageCount - 2);

  const items: PaginationItem[] = [1];
  if (start > 2) items.push('ellipsis-start');
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) items.push(pageNumber);
  if (end < pageCount - 1) items.push('ellipsis-end');
  items.push(pageCount);

  return items;
}

export function ResultPagination({
  page,
  pageCount,
  ariaLabel,
  onPageChange,
}: ResultPaginationProps) {
  if (pageCount < 2) return null;
  const items = getPaginationItems(page, pageCount);
  const isCompact = pageCount > 4;
  const compactPages = [...new Set([1, page - 1, page, page + 1, pageCount])].filter(
    (pageNumber) => pageNumber >= 1 && pageNumber <= pageCount,
  );

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-6 flex flex-wrap items-center justify-center gap-2 max-[640px]:gap-1 max-[360px]:gap-0"
    >
      <Button
        aria-label="Halaman sebelumnya"
        className="size-11 !min-h-0 !rounded-xl !border-[#d8dee7] !p-0 !text-[#1b304c] disabled:!text-[#a8b2bf] max-[640px]:!size-10 max-[360px]:!size-9"
        isDisabled={page === 1}
        tone="secondary"
        onPress={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" size={20} />
      </Button>
      {items.map((item) => {
        if (typeof item !== 'number') {
          return (
            <span
              aria-hidden="true"
              className={`inline-flex size-11 items-center justify-center text-sm text-[#617087] max-[640px]:h-10 max-[640px]:w-3 ${isCompact ? 'max-[640px]:hidden' : ''}`}
              key={item}
            >
              …
            </span>
          );
        }

        const isCurrentPage = item === page;
        const compactIndex = compactPages.indexOf(item);
        const previousCompactPage = compactPages[compactIndex - 1];
        const hasCompactGapBefore =
          isCompact && previousCompactPage !== undefined && item - previousCompactPage > 1;
        const isHiddenSibling = isCompact && !compactPages.includes(item);

        return (
          <Fragment key={item}>
            {hasCompactGapBefore && (
              <span
                aria-hidden="true"
                className="hidden items-center text-sm text-[#617087] max-[640px]:inline-flex"
                data-pagination-ellipsis="before"
              >
                …
              </span>
            )}
            <Button
              aria-current={isCurrentPage ? 'page' : undefined}
              aria-label={`Halaman ${item}`}
              className={`size-11 !min-h-0 !rounded-xl !p-0 !text-base !font-medium max-[640px]:!size-10 max-[360px]:!size-9 max-[640px]:!text-sm ${isCurrentPage ? '!border-[#196dcc] !bg-[#196dcc] !text-white' : '!border-[#d8dee7] !text-[#1b304c]'} ${isHiddenSibling ? 'max-[640px]:!hidden' : ''}`}
              tone={isCurrentPage ? 'primary' : 'secondary'}
              onPress={() => onPageChange(item)}
            >
              {item}
            </Button>
          </Fragment>
        );
      })}
      <Button
        aria-label="Halaman berikutnya"
        className="size-11 !min-h-0 !rounded-xl !border-[#d8dee7] !p-0 !text-[#1b304c] disabled:!text-[#a8b2bf] max-[640px]:!size-10 max-[360px]:!size-9"
        isDisabled={page === pageCount}
        tone="secondary"
        onPress={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden="true" size={20} />
      </Button>
    </nav>
  );
}
