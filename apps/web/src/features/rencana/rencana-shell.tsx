'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { useHydrated } from '@/hooks/use-hydrated';
import { RENCANA_NAV } from './constants';
import { RENCANA_PAGE_CONTENT, RENCANA_SUMMARY_CONTENT } from './content';
import { DeviceDataPanel } from './device-data-panel';
import { RencanaHeader } from './rencana-header';
import { RencanaNav } from './rencana-nav';
import { useRencanaState } from './rencana-context';
import type { RencanaShellProps } from './types';

export function RencanaShell({ children }: RencanaShellProps) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { entries, saved, deadlines } = useRencanaState();
  const page =
    RENCANA_PAGE_CONTENT.find((entry) => entry.href === pathname) ?? RENCANA_SUMMARY_CONTENT;
  const section = RENCANA_NAV.find((entry) => entry.href === pathname)?.label ?? 'Ringkasan';

  return (
    <div className="rencana-shell">
      <aside className="rencana-sidebar">
        <div className="rencana-sidebar-brand">
          <Logo />
          <Link className="rencana-mobile-back" href="/" aria-label="Kembali ke Beranda">
            <ArrowLeft size={19} />
          </Link>
        </div>
        <div className="rencana-sidebar-intro">
          <strong>Rencanaku</strong>
          <p>Atur langkahmu dari sini.</p>
        </div>
        <RencanaNav
          counts={{
            berkas: hydrated ? entries.length : 0,
            tersimpan: hydrated ? saved.length : 0,
            tenggat: hydrated ? deadlines.length : 0,
          }}
        />
        <p className="rencana-sidebar-note">Pilihan dan progresmu tersimpan di perangkat ini.</p>
      </aside>
      <div className="rencana-workspace">
        <RencanaHeader section={section} />
        <div className="rencana-content">
          <div className="rencana-intro">
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </div>
          <div className="rencana-main">
            {hydrated ? (
              <>
                {children}
                <DeviceDataPanel />
              </>
            ) : (
              <p className="small-note" aria-live="polite">
                Memuat rencanamu
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
