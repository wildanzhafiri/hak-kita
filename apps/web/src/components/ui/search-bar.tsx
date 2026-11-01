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
      className={`flex min-h-[62px] items-center overflow-hidden rounded-[9px] border border-[#b9c1ca] bg-white text-left focus-within:outline-2 focus-within:outline-[#bed9f8] focus-within:outline-offset-2 ${className}`}
      onSubmit={handleSubmit}
    >
      <Search className="ml-[22px] shrink-0 text-[#9099a4]" size={20} />
      <TextInput
        className="!min-w-0 !flex-1 !rounded-none !border-0 !bg-transparent !px-3 !py-[18px] !text-[15px] !text-[var(--text)] !shadow-none !outline-none !ring-0 placeholder:!text-[#77808c] focus:!border-0 focus:!shadow-none focus:!ring-0"
        autoFocus={autoFocus}
        required
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={inputLabel}
        placeholder={placeholder}
      />
      <Button
        className="min-h-[60px] min-w-[122px] shrink-0 gap-2.5 rounded-none px-5 text-[17px]"
        type="submit"
        aria-label="Cari"
      >
        {submitIcon ?? <Search aria-hidden="true" size={18} />}
        {submitLabel && <span>{submitLabel}</span>}
      </Button>
    </form>
  );
}
