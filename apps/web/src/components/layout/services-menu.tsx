'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { SERVICE_SECTIONS } from '@/config/sections';
import type { ServicesMenuProps } from './types';

export function ServicesMenu({ pathname }: ServicesMenuProps) {
  const [open, setOpen] = useState(false);
  const isActive = SERVICE_SECTIONS.some((section) => pathname.startsWith(`/${section.slug}`));

  return (
    <div
      className="menu-parent"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <button
        className={isActive ? 'nav-active' : undefined}
        aria-expanded={open}
        aria-controls="menu-layanan"
        onClick={() => setOpen(!open)}
      >
        Jelajahi Layanan <ChevronDown size={14} />
      </button>
      {open && (
        <div className="mega-menu" id="menu-layanan">
          {SERVICE_SECTIONS.map(({ slug, nama, deskripsi, warna, icon: Icon }) => (
            <Link href={`/${slug}`} key={slug} onClick={() => setOpen(false)}>
              <span className={`module-mini ${warna}`}>
                <Icon size={26} strokeWidth={1.6} />
              </span>
              <span>
                <strong>{nama}</strong>
                <small>{deskripsi}</small>
              </span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
