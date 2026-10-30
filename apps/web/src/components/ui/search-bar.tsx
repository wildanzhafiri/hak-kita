'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { searchHref } from '@/config/routes';
import type { SearchBarProps } from './types';

export function SearchBar({
  inputLabel,
  placeholder,
  submitIcon,
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
    <form className="search-bar" onSubmit={handleSubmit}>
      <Search size={20} />
      <input
        autoFocus={autoFocus}
        required
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={inputLabel}
        placeholder={placeholder}
      />
      <button type="submit" aria-label="Cari">
        {submitIcon}
      </button>
    </form>
  );
}
