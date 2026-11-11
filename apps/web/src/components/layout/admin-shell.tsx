'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ADMIN_SIGN_OUT_FAILURE_COPY } from './content';
import { AdminSidebar } from './admin-sidebar';
import type { AdminShellProps } from './types';

export function AdminShell({ adminEmail, activeSection, children }: AdminShellProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 901px)');
    function handleViewportChange(event: MediaQueryListEvent) {
      if (event.matches) setIsMenuOpen(false);
    }
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  async function handleSignOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setSignOutError(null);
    const client = getSupabaseBrowserClient();
    if (!client) {
      setSignOutError(ADMIN_SIGN_OUT_FAILURE_COPY);
      setIsSigningOut(false);
      return;
    }
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        setSignOutError(ADMIN_SIGN_OUT_FAILURE_COPY);
        setIsSigningOut(false);
        return;
      }
    } catch {
      setSignOutError(ADMIN_SIGN_OUT_FAILURE_COPY);
      setIsSigningOut(false);
      return;
    }
    router.replace('/');
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-[#f5f8fc] text-[#25354b]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] border-r border-[#e2e8f0] bg-white min-[901px]:block">
        <AdminSidebar
          activeSection={activeSection}
          adminEmail={adminEmail}
          isSigningOut={isSigningOut}
          onSignOut={handleSignOut}
          signOutError={signOutError}
        />
      </aside>

      <div className="min-w-0 min-[901px]:ml-[244px]">
        <header className="sticky top-0 z-20 flex min-h-[68px] items-center justify-between gap-4 border-b border-[#e2e8f0] bg-white px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              aria-label="Buka navigasi admin"
              className="min-[901px]:hidden"
              onPress={() => setIsMenuOpen(true)}
              tone="icon"
            >
              <Menu aria-hidden="true" size={20} />
            </Button>
            <p className="truncate text-sm font-semibold text-[#26364b]">
              {activeSection === 'validation'
                ? 'Validasi Informasi'
                : activeSection === 'programs'
                  ? 'Kelola Informasi'
                  : 'Riwayat Aktivitas'}
            </p>
          </div>
          <p className="hidden max-w-[34ch] truncate text-sm text-[#68788d] md:block">
            {adminEmail}
          </p>
        </header>

        <main
          className="mx-auto min-h-[calc(100dvh-68px)] max-w-[1500px] px-8 py-9 max-[900px]:px-6 max-[640px]:px-4 max-[640px]:py-6"
          id="admin-main"
        >
          {children}
        </main>
      </div>

      <Dialog
        closeLabel="Tutup navigasi admin"
        description="Pilih bagian panel admin yang ingin dibuka."
        onOpenChange={setIsMenuOpen}
        open={isMenuOpen}
        side
        title="Menu admin"
        trigger={null}
      >
        <AdminSidebar
          activeSection={activeSection}
          adminEmail={adminEmail}
          isSigningOut={isSigningOut}
          onNavigate={() => setIsMenuOpen(false)}
          onSignOut={handleSignOut}
          signOutError={signOutError}
        />
      </Dialog>
    </div>
  );
}
