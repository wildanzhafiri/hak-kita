'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { searchHref } from '@/config/routes';
import { Button } from './button';
import { TextInput } from './text-input';
import type { SearchBarProps } from './types';

export function SearchBar({
  inputLabel,
  placeholder,
  submitIcon,
  submitLabel,
  className = '',
  autoFocus = false,
  onSubmitted,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitted?.();
    router.push(searchHref(query));
  }

  return (
    <form
      className={`flex min-h-[62px] items-center overflow-hidden rounded-[9px] max-[640px]:h-12 max-[640px]:min-h-12 border border-[#b9c1ca] bg-white text-left focus-within:outline-2 focus-within:outline-[#bed9f8] focus-within:outline-offset-2 ${className}`}
      onSubmit={handleSubmit}
    >
      <Search className="ml-[22px] shrink-0 text-[#9099a4] max-[640px]:hidden" size={20} />
      <TextInput
        className="!min-w-0 !flex-1 !rounded-none !border-0 !bg-transparent !px-3 !py-[18px] !text-[15px] !text-[var(--text)] !shadow-none !outline-none !ring-0 placeholder:!text-[#77808c] max-[640px]:text-sm! max-[640px]:py-3.5! max-[640px]:pl-[15px]! max-[640px]:pr-[9px]! max-[640px]:placeholder:text-[13px]! focus:!border-0 focus:!shadow-none focus:!ring-0"
        autoFocus={autoFocus}
        required
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={inputLabel}
        placeholder={placeholder}
      />
      <Button
        className="min-h-[60px] min-w-[122px] shrink-0 gap-2.5 rounded-none px-5 text-[17px] max-[640px]:h-12 max-[640px]:min-h-12 max-[640px]:w-[54px] max-[640px]:min-w-[54px] max-[640px]:gap-0 max-[640px]:p-0"
        type="submit"
        aria-label="Cari"
      >
        {submitIcon ?? <Search aria-hidden="true" className="max-[640px]:size-[21px]" size={18} />}
        {submitLabel && <span className="max-[640px]:hidden">{submitLabel}</span>}
      </Button>
    </form>
  );
}
