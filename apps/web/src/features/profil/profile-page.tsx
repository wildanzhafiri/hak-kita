'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CircleCheck, LogOut } from 'lucide-react';
import { hasPreferences } from '@hakkita/domain';
import { SignOutDialog } from '@/components/layout/sign-out-dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { AccountAvatar } from './account-avatar';
import { AccountGate } from './account-gate';
import { ACTIVITY_LABELS, EDUCATION_LABELS } from './constants';
import { ACCOUNT_GATE_COPY, PROFILE_COPY, PROFILE_PAGE_COPY as COPY } from './content';
import { profileDisplayName } from './profile-initials';
import { buildProfileRegions, describeRegion } from './profile-regions';
import { ProfileSummary } from './profile-summary';
import type { ProfilePageProps, ProfileSummaryRow } from './types';
import { useProfile } from './use-profile';

const SETTING_ROW_CLASSES =
  'flex min-h-16 w-full items-center justify-between gap-4 px-1 py-3 text-left text-[#253044] transition-colors hover:bg-[#f5f8fc] focus-visible:bg-[#f5f8fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2] motion-reduce:transition-none';

export function ProfilePage({ wilayah, isSaved }: ProfilePageProps) {
  const { user, isReady } = useAuth();
  const { status, nama, preferensi, clearPreferences } = useProfile();
  const regions = useMemo(() => buildProfileRegions(wilayah), [wilayah]);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);
  const [isCleared, setIsCleared] = useState(false);

  if (!isReady || (user && status === 'loading')) {
    return <p className="text-sm text-[#617087]">{PROFILE_COPY.loading}</p>;
  }
  if (!user) return <AccountGate next="/profil" title={ACCOUNT_GATE_COPY.profileTitle} />;
  if (status === 'error') {
    return (
      <p className="text-sm text-[#a13239]" role="alert">
        {PROFILE_COPY.loadError}
      </p>
    );
  }

  const email = user.email ?? '';
  const hasProfile = hasPreferences(preferensi);
  const rows: ProfileSummaryRow[] = [
    {
      label: COPY.rows.region,
      value: describeRegion(regions, preferensi.provinsi, preferensi.kota),
    },
    {
      label: COPY.rows.activities,
      value: preferensi.kegiatan.map((activity) => ACTIVITY_LABELS[activity]).join(', '),
      note: preferensi.kegiatan.includes('lainnya') ? preferensi.kegiatanLain.trim() : undefined,
    },
    {
      label: COPY.rows.education,
      value: preferensi.pendidikan ? EDUCATION_LABELS[preferensi.pendidikan] : '',
    },
    { label: COPY.rows.interests, value: preferensi.minat.join(', ') },
  ].filter((row) => row.value);

  async function handleClear() {
    if (isClearing) return;
    setIsClearing(true);
    setClearError(null);
    const error = await clearPreferences();
    setIsClearing(false);
    if (error) {
      setClearError(error);
      return;
    }
    setIsClearOpen(false);
    setIsCleared(true);
  }

  return (
    <div className="flex flex-col gap-7">
      {(isSaved || isCleared) && (
        <p
          className="m-0 flex items-start gap-3 rounded-xl border border-[#b8e1cc] bg-[#edf8f1] px-4 py-3 text-sm text-[#226b43]"
          role="status"
        >
          <CircleCheck aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
          {isCleared ? COPY.cleared : COPY.saved}
        </p>
      )}
      <section className="flex items-center gap-4 border-b border-[#e7ecf2] pb-6">
        <AccountAvatar email={email} nama={nama} />
        <div className="min-w-0">
          <h2 className="m-0 mb-1 text-base font-semibold text-[#253044] [overflow-wrap:anywhere]">
            {profileDisplayName(nama, email)}
          </h2>
          {nama.trim() && (
            <p className="m-0 text-sm text-[#64748b] [overflow-wrap:anywhere]">{email}</p>
          )}
        </div>
      </section>
      <section className="border-b border-[#e7ecf2] pb-7">
        <h2 className="m-0 mb-4 text-xl font-semibold text-[#253044]">{COPY.preferencesHeading}</h2>
        {hasProfile ? (
          <>
            <ProfileSummary rows={rows} />
            <Link className="button" href="/profil/edit?dari=profil">
              {COPY.changeAction}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </>
        ) : (
          <div className="rounded-[14px] border border-[#e1e9f2] bg-[#f5f8fc] px-6 py-5">
            <h3 className="m-0 mb-2 text-[17px] font-semibold text-[#253044]">{COPY.emptyTitle}</h3>
            <p className="m-0 mb-4 max-w-[620px] text-sm leading-6 text-[#475569]">
              {COPY.emptyDescription}
            </p>
            <Link className="button" href="/profil/edit?dari=profil">
              {COPY.setAction}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        )}
      </section>
      <section>
        <h2 className="m-0 mb-3 text-xl font-semibold text-[#253044]">{COPY.settingsHeading}</h2>
        <div className="grid divide-y divide-[#e7ecf2]">
          {hasProfile && (
            <button
              className={`${SETTING_ROW_CLASSES} hover:text-[#a13239]`}
              onClick={() => {
                setClearError(null);
                setIsClearOpen(true);
              }}
              type="button"
            >
              <span className="grid gap-1">
                <strong className="text-[15px] font-semibold">{COPY.clearTitle}</strong>
                <small className="text-[13px] text-[#64748b]">{COPY.clearDescription}</small>
              </span>
              <ArrowRight aria-hidden="true" className="shrink-0 text-[#a13239]" size={18} />
            </button>
          )}
          <SignOutDialog
            renderTrigger={(openDialog) => (
              <button className={SETTING_ROW_CLASSES} onClick={openDialog} type="button">
                <span className="grid gap-1">
                  <strong className="text-[15px] font-semibold">{COPY.signOutTitle}</strong>
                  <small className="text-[13px] text-[#64748b]">{COPY.signOutDescription}</small>
                </span>
                <LogOut aria-hidden="true" className="shrink-0 text-[#64748b]" size={18} />
              </button>
            )}
          />
        </div>
      </section>
      <Dialog
        closeLabel="Tutup konfirmasi hapus profil"
        description={COPY.clearDialogDescription}
        onOpenChange={(open) => {
          if (!isClearing) setIsClearOpen(open);
        }}
        open={isClearOpen}
        title={COPY.clearDialogTitle}
        trigger={null}
      >
        {clearError && (
          <p className="mb-4 text-sm text-[#a13239]" role="alert">
            {clearError}
          </p>
        )}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            isDisabled={isClearing}
            onPress={() => setIsClearOpen(false)}
            tone="secondary"
          >
            {COPY.cancel}
          </Button>
          <Button className="flex-1" isDisabled={isClearing} onPress={() => void handleClear()}>
            {isClearing ? COPY.clearing : COPY.clearConfirm}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
