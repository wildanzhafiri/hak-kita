'use client';

import { useMemo } from 'react';
import { hasPreferences } from '@hakkita/domain';
import { useAuth } from '@/hooks/use-auth';
import { AccountGate } from './account-gate';
import { ACCOUNT_GATE_COPY, PROFILE_COPY } from './content';
import { ProfileEditorForm } from './profile-editor-form';
import { createDraft } from './profile-draft';
import { buildProfileRegions } from './profile-regions';
import type { ProfileEditorProps } from './types';
import { useProfile } from './use-profile';

export function ProfileEditor({ wilayah, fromProfile }: ProfileEditorProps) {
  const { user, isReady } = useAuth();
  const { status, nama, preferensi } = useProfile();
  const regions = useMemo(() => buildProfileRegions(wilayah), [wilayah]);
  const initialDraft = useMemo(() => createDraft(nama, preferensi), [nama, preferensi]);

  if (!isReady || (user && status === 'loading')) {
    return <p className="text-sm text-[#617087]">{PROFILE_COPY.loading}</p>;
  }
  if (!user) return <AccountGate next="/profil/edit" title={ACCOUNT_GATE_COPY.editorTitle} />;
  if (status === 'error') {
    return (
      <p className="text-sm text-[#a13239]" role="alert">
        {PROFILE_COPY.loadError}
      </p>
    );
  }

  return (
    <ProfileEditorForm
      fromProfile={fromProfile || hasPreferences(preferensi)}
      hadName={nama.trim().length > 0}
      initialDraft={initialDraft}
      key={user.id}
      regions={regions}
    />
  );
}
