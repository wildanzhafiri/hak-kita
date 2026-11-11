'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResultPaginationProps } from './types';

export function ResultPagination({
  page,
  pageCount,
  ariaLabel,
  onPageChange,
}: ResultPaginationProps) {
  if (pageCount < 2) return null;

  return (
    <nav aria-label={ariaLabel} className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Button
        aria-label="Halaman sebelumnya"
        className="size-11 !min-h-0 !rounded-xl !border-[#d8dee7] !p-0 !text-[#1b304c] disabled:!text-[#a8b2bf]"
        isDisabled={page === 1}
        tone="secondary"
        onPress={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" size={20} />
      </Button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
        <Button
          aria-current={pageNumber === page ? 'page' : undefined}
          aria-label={`Halaman ${pageNumber}`}
          className={`size-11 !min-h-0 !rounded-xl !p-0 !text-base !font-medium ${pageNumber === page ? '!border-[#196dcc] !bg-[#196dcc] !text-white' : '!border-[#d8dee7] !text-[#1b304c]'}`}
          key={pageNumber}
          tone={pageNumber === page ? 'primary' : 'secondary'}
          onPress={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        aria-label="Halaman berikutnya"
        className="size-11 !min-h-0 !rounded-xl !border-[#d8dee7] !p-0 !text-[#1b304c] disabled:!text-[#a8b2bf]"
        isDisabled={page === pageCount}
        tone="secondary"
        onPress={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden="true" size={20} />
      </Button>
    </nav>
  );
}
